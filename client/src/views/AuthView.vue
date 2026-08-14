<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/user'

const router = useRouter()
const userStore = useUserStore()
const mode = ref('login')
const login = ref('')
const email = ref('')
const displayName = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function submit() {
  error.value = ''
  loading.value = true
  try {
    if (mode.value === 'login') await userStore.login({ login: login.value, password: password.value })
    else await userStore.signup({ login: login.value, email: email.value, display_name: displayName.value, password: password.value })
    router.replace('/')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

async function tryDemo() {
  error.value = ''
  loading.value = true
  try {
    await userStore.login({ login: 'demo', password: 'demo12345' })
    router.replace('/')
  } catch {
    try {
      await userStore.signup({
        login: 'demo',
        email: 'demo@nextune.app',
        display_name: 'Demo User',
        password: 'demo12345'
      })
      router.replace('/')
    } catch (err) {
      error.value = err.message || 'Could not start demo. Is the API running?'
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-bg" aria-hidden="true" />

    <section class="auth-card">
      <div class="auth-logo">
        <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
          <circle cx="16" cy="16" r="14" fill="var(--accent)" opacity="0.2"/>
          <path d="M12 10v12l10-6-10-6z" fill="var(--accent)"/>
        </svg>
        <span class="auth-brand">NexTune</span>
      </div>

      <h1>{{ mode === 'login' ? 'Welcome back' : 'Create your account' }}</h1>
      <p class="auth-copy">
        {{ mode === 'login'
          ? 'Sign in to your personalized music experience.'
          : 'Join NexTune and let AI learn what you love.' }}
      </p>

      <button type="button" class="btn-demo" :disabled="loading" @click="tryDemo">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"/>
        </svg>
        {{ loading ? 'Starting…' : 'Try instant demo' }}
      </button>

      <div class="auth-divider"><span>or sign in</span></div>

      <form @submit.prevent="submit">
        <label>Username <input v-model.trim="login" autocomplete="username" minlength="3" required placeholder="your-username" /></label>
        <label v-if="mode === 'signup'">Display name <input v-model.trim="displayName" autocomplete="name" required placeholder="How should we call you?" /></label>
        <label v-if="mode === 'signup'">Email <input v-model.trim="email" type="email" autocomplete="email" required placeholder="you@example.com" /></label>
        <label>Password <input v-model="password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" minlength="8" required placeholder="At least 8 characters" /></label>
        <p v-if="error" class="auth-error" role="alert">{{ error }}</p>
        <button class="btn-pill auth-submit" :disabled="loading">{{ loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account' }}</button>
      </form>

      <button class="auth-switch" @click="mode = mode === 'login' ? 'signup' : 'login'; error = ''">
        {{ mode === 'login' ? 'New here? Create an account' : 'Already have an account? Sign in' }}
      </button>
    </section>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 20% 10%, rgba(0, 212, 170, 0.12), transparent),
    radial-gradient(ellipse 60% 50% at 80% 80%, rgba(99, 102, 241, 0.1), transparent),
    var(--bg-void);
}

.auth-card {
  position: relative;
  width: min(100%, 420px);
  padding: 36px;
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  background: rgba(12, 18, 32, 0.85);
  backdrop-filter: blur(20px);
  box-shadow: var(--shadow-panel);
}

.auth-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.auth-brand {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: -0.03em;
}

h1 { margin-top: 0; font-size: 28px; }
.auth-copy { color: var(--text-secondary); margin: 8px 0 20px; font-size: 14px; }

.btn-demo {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--accent-dim);
  background: var(--accent-wash);
  color: var(--accent);
  font-weight: 700;
  font-size: 14px;
  transition: background 0.15s ease, transform 0.15s ease;
}
.btn-demo:hover:not(:disabled) { background: rgba(0, 212, 170, 0.2); transform: translateY(-1px); }
.btn-demo:disabled { opacity: 0.6; cursor: not-allowed; }

.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: var(--text-tertiary);
  font-size: 12px;
}
.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--line);
}

form { display: grid; gap: 14px; }
label { display: grid; gap: 6px; color: var(--text-secondary); font-size: 12px; font-weight: 600; }
input {
  width: 100%;
  padding: 11px 14px;
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background: var(--bg-raised);
  color: var(--text-primary);
  transition: border-color 0.15s ease;
}
input:focus { border-color: var(--accent-dim); outline: none; }
.auth-submit { justify-content: center; margin-top: 4px; }
.auth-switch { margin-top: 20px; color: var(--accent); font-size: 13px; width: 100%; text-align: center; }
.auth-error { margin: 0; color: var(--danger); font-size: 13px; }
</style>
