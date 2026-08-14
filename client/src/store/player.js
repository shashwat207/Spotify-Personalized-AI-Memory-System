import { defineStore } from 'pinia'
import interactionService from '@/services/interactionService'

let audioEl = null

function getAudio() {
  if (!audioEl) {
    audioEl = new Audio()
    audioEl.preload = 'metadata'
  }
  return audioEl
}

function shuffleArray(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export const usePlayerStore = defineStore('player', {
  state: () => ({
    queue: [],
    originalQueue: [],
    queueIndex: -1,
    currentTrack: null,
    isPlaying: false,
    progressSeconds: 0,
    volume: 0.8,
    isMuted: false,
    shuffle: false,
    repeatMode: 'off',
    _tickHandle: null,
    _audioBound: false,
    _playSource: null
  }),

  getters: {
    hasNext: (state) => state.queueIndex < state.queue.length - 1 || state.repeatMode !== 'off',
    hasPrevious: (state) => state.queueIndex > 0,
    progressPct: (state) => {
      if (!state.currentTrack?.durationSeconds) return 0
      return Math.min(100, (state.progressSeconds / state.currentTrack.durationSeconds) * 100)
    }
  },

  actions: {
    playQueue(tracks, startIndex = 0, source = 'unknown') {
      this.originalQueue = [...tracks]
      this._playSource = source

      if (this.shuffle && tracks.length > 1) {
        const current = tracks[startIndex]
        const rest = shuffleArray(tracks.filter((_, i) => i !== startIndex))
        this.queue = [current, ...rest]
        this.queueIndex = 0
      } else {
        this.queue = [...tracks]
        this.queueIndex = startIndex
      }
      this._loadCurrent()
    },

    playTrack(track, source = 'unknown') {
      this.playQueue([track], 0, source)
    },

    togglePlay() {
      if (!this.currentTrack) return
      const audio = getAudio()
      if (this.currentTrack.previewUrl) {
        if (this.isPlaying) {
          audio.pause()
          this.isPlaying = false
        } else {
          audio.play().then(() => { this.isPlaying = true }).catch(() => {
            this.isPlaying = true
            this._startTimerFallback()
          })
        }
      } else {
        this.isPlaying = !this.isPlaying
        this.isPlaying ? this._startTimerFallback() : this._stopTimerFallback()
      }
    },

    pause() {
      this.isPlaying = false
      getAudio().pause()
      this._stopTimerFallback()
    },

    next(auto = false) {
      const prevTrack = this.currentTrack
      if (auto && prevTrack) {
        interactionService.logSkip(prevTrack.id, { atSeconds: this.progressSeconds }).catch(() => {})
      }
      if (this.repeatMode === 'one' && auto) {
        this.progressSeconds = 0
        const audio = getAudio()
        if (this.currentTrack?.previewUrl) {
          audio.currentTime = 0
          audio.play().catch(() => {})
        } else {
          this._startTimerFallback()
        }
        return
      }
      if (this.queueIndex < this.queue.length - 1) {
        this.queueIndex += 1
        this._loadCurrent()
      } else if (this.repeatMode === 'all' && this.queue.length) {
        this.queueIndex = 0
        this._loadCurrent()
      } else {
        this.pause()
      }
    },

    previous() {
      const audio = getAudio()
      if (this.progressSeconds > 3) {
        this.progressSeconds = 0
        if (this.currentTrack?.previewUrl) audio.currentTime = 0
        return
      }
      if (this.queueIndex > 0) {
        this.queueIndex -= 1
        this._loadCurrent()
      }
    },

    seekTo(seconds) {
      this.progressSeconds = seconds
      if (this.currentTrack?.previewUrl) {
        getAudio().currentTime = seconds
      }
    },

    setVolume(value) {
      this.volume = value
      this.isMuted = value === 0
      const audio = getAudio()
      audio.volume = this.isMuted ? 0 : value
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      getAudio().volume = this.isMuted ? 0 : this.volume
    },

    toggleShuffle() {
      this.shuffle = !this.shuffle
      if (!this.currentTrack || this.originalQueue.length < 2) return

      const currentId = this.currentTrack.id
      if (this.shuffle) {
        const rest = shuffleArray(this.originalQueue.filter((t) => t.id !== currentId))
        this.queue = [this.currentTrack, ...rest]
        this.queueIndex = 0
      } else {
        this.queue = [...this.originalQueue]
        this.queueIndex = this.queue.findIndex((t) => t.id === currentId)
      }
    },

    cycleRepeat() {
      this.repeatMode = { off: 'all', all: 'one', one: 'off' }[this.repeatMode]
    },

    resetSession() {
      this._stopTimerFallback()
      getAudio().pause()
      getAudio().src = ''
      this.queue = []
      this.originalQueue = []
      this.queueIndex = -1
      this.currentTrack = null
      this.isPlaying = false
      this.progressSeconds = 0
      this.shuffle = false
      this.repeatMode = 'off'
      this._playSource = null
    },

    _bindAudio() {
      if (this._audioBound) return
      const audio = getAudio()
      audio.addEventListener('timeupdate', () => {
        if (!this.currentTrack?.previewUrl) return
        this.progressSeconds = audio.currentTime
      })
      audio.addEventListener('ended', () => {
        if (this.currentTrack?.previewUrl) this.next(true)
      })
      this._audioBound = true
    },

    async _loadCurrent() {
      this._bindAudio()
      this._stopTimerFallback()
      const audio = getAudio()
      audio.pause()

      this.currentTrack = this.queue[this.queueIndex] || null
      this.progressSeconds = 0

      if (!this.currentTrack) {
        this.isPlaying = false
        return
      }

      interactionService.logPlay(this.currentTrack.id, { source: this._playSource }).catch(() => {})

      const url = this.currentTrack.previewUrl
      if (url) {
        audio.src = url
        audio.volume = this.isMuted ? 0 : this.volume
        try {
          await audio.play()
          this.isPlaying = true
        } catch {
          this.isPlaying = true
          this._startTimerFallback()
        }
      } else {
        this.isPlaying = true
        this._startTimerFallback()
      }
    },

    _startTimerFallback() {
      this._stopTimerFallback()
      this._tickHandle = setInterval(() => {
        if (!this.currentTrack) return
        this.progressSeconds += 1
        if (this.progressSeconds >= this.currentTrack.durationSeconds) {
          this.next(true)
        }
      }, 1000)
    },

    _stopTimerFallback() {
      if (this._tickHandle) {
        clearInterval(this._tickHandle)
        this._tickHandle = null
      }
    }
  }
})
