<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/user'

const route = useRoute()
const userStore = useUserStore()

const navLinks = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/library', label: 'Library', icon: 'library' }
]

const isActive = (path) => computed(() => route.path === path).value
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__mark" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="currentColor" opacity="0.15"/>
          <path d="M12 10v12l10-6-10-6z" fill="currentColor"/>
        </svg>
      </span>
      <span class="sidebar__name">NexTune</span>
    </div>

    <nav class="sidebar__nav">
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="sidebar__link"
        :class="{ 'sidebar__link--active': isActive(link.to) }"
      >
        <span class="sidebar__icon" v-html="icons[link.icon]" />
        {{ link.label }}
      </router-link>
    </nav>

    <div class="sidebar__divider" />

    <div class="sidebar__section">
      <span class="eyebrow">Your playlists</span>
      <ul class="sidebar__playlists">
        <li v-for="playlist in userStore.library.playlists" :key="playlist.id">
          <router-link :to="`/playlist/${playlist.id}`" class="sidebar__playlist-link">
            {{ playlist.name }}
          </router-link>
        </li>
        <li v-if="!userStore.library.playlists.length" class="sidebar__empty">
          Playlists appear here once you explore.
        </li>
      </ul>
    </div>

    <div class="sidebar__ai-hint">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 2a4 4 0 0 1 4 4v1h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h2V6a4 4 0 0 1 4-4z"/>
      </svg>
      <span>Tap the AI button to teach NexTune your taste</span>
    </div>
  </aside>
</template>

<script>
const icons = {
  home: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h5v-5h2v5h5v-9"/></svg>',
  search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  library: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16" y="10" width="4" height="10" rx="1"/></svg>'
}
export default { data: () => ({ icons }) }
</script>

<style scoped>
.sidebar {
  background: var(--bg-base);
  border-right: 1px solid var(--line-soft);
  padding: 20px 12px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
}

.sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 4px 12px 20px;
  color: var(--accent);
}

.sidebar__name {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

.sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-weight: 600;
  font-size: 14px;
  transition: background 0.15s ease, color 0.15s ease;
}

.sidebar__link:hover { color: var(--text-primary); background: var(--bg-hover); }
.sidebar__link--active { color: var(--accent); background: var(--accent-wash); }
.sidebar__icon { display: inline-flex; }

.sidebar__divider {
  height: 1px;
  background: var(--line-soft);
  margin: 16px 8px;
}

.sidebar__section {
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  flex: 1;
}

.sidebar__playlists {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar__playlist-link {
  display: block;
  padding: 7px 4px;
  color: var(--text-secondary);
  font-size: 13.5px;
  border-radius: var(--radius-sm);
}
.sidebar__playlist-link:hover { color: var(--text-primary); }

.sidebar__empty {
  color: var(--text-tertiary);
  font-size: 12.5px;
  line-height: 1.5;
  padding: 4px;
}

.sidebar__ai-hint {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: auto;
  padding: 12px;
  border-radius: var(--radius-md);
  background: var(--accent-wash);
  color: var(--text-secondary);
  font-size: 11.5px;
  line-height: 1.45;
}

@media (max-width: 860px) {
  .sidebar { display: none; }
}
</style>
