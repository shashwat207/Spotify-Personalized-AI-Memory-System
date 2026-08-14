<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()

const navLinks = [
  { to: '/', label: 'Home', icon: 'home' },
  { to: '/search', label: 'Search', icon: 'search' },
  { to: '/library', label: 'Library', icon: 'library' }
]

const isActive = (path) => route.path === path
</script>

<template>
  <nav class="mobile-nav" aria-label="Main navigation">
    <router-link
      v-for="link in navLinks"
      :key="link.to"
      :to="link.to"
      class="mobile-nav__link"
      :class="{ 'mobile-nav__link--active': isActive(link.to) }"
    >
      <span class="mobile-nav__icon" v-html="icons[link.icon]" />
      <span>{{ link.label }}</span>
    </router-link>
  </nav>
</template>

<script>
const icons = {
  home: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9h5v-5h2v5h5v-9"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  library: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="4" width="4" height="16" rx="1"/><rect x="10" y="7" width="4" height="13" rx="1"/><rect x="16" y="10" width="4" height="10" rx="1"/></svg>'
}
export default { data: () => ({ icons }) }
</script>

<style scoped>
.mobile-nav {
  display: none;
}

@media (max-width: 860px) {
  .mobile-nav {
    display: flex;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: var(--mobile-nav-h);
    background: var(--bg-base);
    border-top: 1px solid var(--line-soft);
    z-index: 15;
    padding-bottom: env(safe-area-inset-bottom);
  }

  .mobile-nav__link {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: var(--text-tertiary);
    font-size: 10px;
    font-weight: 600;
    padding: 8px 4px;
  }

  .mobile-nav__link--active { color: var(--accent); }
  .mobile-nav__icon { display: flex; }
}
</style>
