<script setup>
import { ref, onMounted } from 'vue'
import interactionService from '@/services/interactionService'
import TrackCard from '@/components/tracks/TrackCard.vue'
import TrackList from '@/components/tracks/TrackList.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const loading = ref(true)
const error = ref(null)
const feed = ref({ recommended: [], recentlyPlayed: [], forYouGenres: [] })
const artists = ref([])

async function load() {
  loading.value = true
  error.value = null
  try {
    const [homeFeed, featuredArtists] = await Promise.all([
      interactionService.getHomeFeed(),
      interactionService.getArtists()
    ])
    feed.value = homeFeed
    artists.value = featuredArtists
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(load)

const greeting = () => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}
</script>

<template>
  <section class="home">
    <header class="home__hero">
      <div class="home__hero-content">
        <span class="eyebrow">{{ greeting() }}</span>
        <h1>{{ userStore.displayName ? `${greeting()}, ${userStore.displayName}` : 'Discover your sound' }}</h1>
        <p class="home__subhead">
          NexTune learns from every play, skip, and chat — then surfaces music you'll actually love.
        </p>
        <div class="home__features">
          <span class="home__feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
            Smart playback
          </span>
          <span class="home__feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 1 1-3.2-6.4"/><path d="M21 4v5h-5"/></svg>
            AI memory
          </span>
          <span class="home__feature">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z"/></svg>
            Personalized picks
          </span>
        </div>
      </div>
    </header>

    <p v-if="error" class="home__error">
      Couldn't load your feed — {{ error }}. Make sure the backend API is running on port 8000.
    </p>

    <template v-if="!loading && !error">
      <section v-if="feed.recommended?.length" class="home__section">
        <h2>Recommended for you</h2>
        <div class="home__grid">
          <TrackCard
            v-for="track in feed.recommended"
            :key="track.id"
            :track="track"
            :queue="feed.recommended"
            source="home-recommended"
          />
        </div>
      </section>

      <section v-if="artists.length" class="home__section">
        <h2>Trending artists</h2>
        <div class="home__artists">
          <article v-for="artist in artists" :key="artist.id" class="home__artist">
            <router-link :to="`/artist/${artist.id}`" class="home__artist-link">
              <img v-if="artist.imageUrl" :src="artist.imageUrl" :alt="artist.name" class="home__artist-img" />
              <span v-else class="home__artist-avatar">{{ artist.name.charAt(0) }}</span>
              <span>{{ artist.name }}</span>
              <small v-if="artist.monthlyListeners">{{ (artist.monthlyListeners / 1000).toFixed(0) }}K listeners</small>
            </router-link>
            <button class="btn-ghost home__follow" :class="{ 'home__following': userStore.isFollowing(artist.id) }" @click="userStore.toggleFollow(artist)">
              {{ userStore.isFollowing(artist.id) ? 'Following' : 'Follow' }}
            </button>
          </article>
        </div>
      </section>

      <section v-if="feed.recentlyPlayed?.length" class="home__section">
        <h2>Recently played</h2>
        <TrackList :tracks="feed.recentlyPlayed" source="home-recent" :show-header="false" />
      </section>

      <section
        v-for="genreShelf in feed.forYouGenres"
        :key="genreShelf.genre"
        class="home__section"
      >
        <h2>{{ genreShelf.genre }}</h2>
        <div class="home__grid">
          <TrackCard
            v-for="track in genreShelf.tracks"
            :key="track.id"
            :track="track"
            :queue="genreShelf.tracks"
            :source="`home-${genreShelf.genre}`"
          />
        </div>
      </section>

      <p
        v-if="!feed.recommended?.length && !feed.recentlyPlayed?.length && !feed.forYouGenres?.length"
        class="home__empty"
      >
        Play a few tracks or tell the AI assistant what you like — your feed will adapt instantly.
      </p>
    </template>

    <p v-if="loading" class="home__loading">Loading your personalized feed…</p>
  </section>
</template>

<style scoped>
.home__hero {
  margin-bottom: 32px;
  padding: 28px 32px;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(0, 212, 170, 0.08), rgba(99, 102, 241, 0.06));
  border: 1px solid var(--line-soft);
  position: relative;
  overflow: hidden;
}

.home__hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 170, 0.1), transparent 70%);
  pointer-events: none;
}

.home__hero-content { position: relative; }
.home__hero h1 { font-size: 30px; margin: 6px 0 8px; }
.home__subhead { margin: 0 0 16px; color: var(--text-secondary); font-size: 14px; max-width: 520px; line-height: 1.6; }

.home__features { display: flex; flex-wrap: wrap; gap: 12px; }
.home__feature {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: var(--radius-pill);
  background: var(--bg-raised);
  border: 1px solid var(--line-soft);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 600;
}
.home__feature svg { color: var(--accent); }

.home__section { margin-bottom: 32px; }
.home__section h2 { font-size: 20px; margin-bottom: 14px; }

.home__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 14px;
}

.home__artists { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 14px; }
.home__artist {
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-md);
  background: var(--bg-raised);
  transition: border-color 0.15s ease, transform 0.15s ease;
}
.home__artist:hover { border-color: var(--line); transform: translateY(-2px); }

.home__artist-link {
  display: grid;
  justify-items: center;
  gap: 8px;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 13px;
  text-align: center;
}
.home__artist-link small { color: var(--text-tertiary); font-weight: 500; font-size: 11px; }

.home__artist-img {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
}

.home__artist-avatar {
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--accent-wash);
  color: var(--accent);
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
}

.home__follow { justify-content: center; padding: 7px 12px; font-size: 12px; }
.home__following { color: var(--accent); border-color: var(--accent-dim); background: var(--accent-wash); }

.home__loading, .home__empty { color: var(--text-tertiary); font-size: 13.5px; padding: 24px 0; }
.home__error {
  color: var(--danger);
  font-size: 13.5px;
  background: rgba(248, 113, 113, 0.1);
  padding: 12px 14px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(248, 113, 113, 0.2);
}

@media (max-width: 860px) {
  .home__hero { padding: 20px; }
  .home__hero h1 { font-size: 24px; }
}
</style>
