// Client-side Supabase auth helper for email/password flows
// Requires `auth-config.js` to expose window.SUPABASE_URL and window.SUPABASE_ANON_KEY

;(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    document.addEventListener('DOMContentLoaded', () => {
      const status = document.getElementById('status')
      if (status) {
        status.innerHTML = '<div class="message error">Please configure your Supabase keys in <code>auth-config.js</code></div>'
      }
    })
    return
  }

  const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)

  // Elements
  const tabSignin = document.getElementById('tab-signin')
  const tabSignup = document.getElementById('tab-signup')
  const signinForm = document.getElementById('signin-form')
  const signupForm = document.getElementById('signup-form')
  const resetForm = document.getElementById('reset-form')
  const statusEl = document.getElementById('status')
  const signedInPanel = document.getElementById('signed-in-panel')
  const userEmailEl = document.getElementById('user-email')

  function showMessage(type, text) {
    if (!statusEl) return
    statusEl.innerHTML = `<div class="message ${type}">${text}</div>`
  }

  function clearMessage() {
    if (!statusEl) return
    statusEl.innerHTML = ''
  }

  function switchTo(tab) {
    clearMessage()
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'))
    document.querySelectorAll('form').forEach(f => (f.style.display = 'none'))
    if (tab === 'signin') {
      tabSignin.classList.add('active')
      signinForm.style.display = ''
    } else if (tab === 'signup') {
      tabSignup.classList.add('active')
      signupForm.style.display = ''
    } else if (tab === 'reset') {
      resetForm.style.display = ''
    }
  }

  tabSignin.addEventListener('click', () => switchTo('signin'))
  tabSignup.addEventListener('click', () => switchTo('signup'))
  document.getElementById('to-signin').addEventListener('click', () => switchTo('signin'))
  document.getElementById('to-reset').addEventListener('click', () => switchTo('reset'))
  document.getElementById('reset-back').addEventListener('click', () => switchTo('signin'))

  // Sign up
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()
    const email = document.getElementById('signup-email').value.trim()
    const password = document.getElementById('signup-password').value
    if (!email || !password) return showMessage('error', 'Email and password are required')

    showMessage('success', 'Creating account — check your inbox if email confirmation is required...')

    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      showMessage('error', error.message || 'Failed to sign up')
      return
    }
    showMessage('success', 'Account created. If your project requires email confirmation, check your mail. Otherwise you are signed in.')
    // If session exists, redirect
    if (data && data.session) {
      window.location.href = 'index.html'
    }
  })

  // Sign in
  signinForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()
    const email = document.getElementById('signin-email').value.trim()
    const password = document.getElementById('signin-password').value
    if (!email || !password) return showMessage('error', 'Email and password are required')

    showMessage('success', 'Signing in...')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      showMessage('error', error.message || 'Failed to sign in')
      return
    }
    showMessage('success', 'Signed in. Redirecting...')
    // short delay so user sees message
    setTimeout(() => (window.location.href = 'index.html'), 800)
  })

  // Reset password (send email)
  resetForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()
    const email = document.getElementById('reset-email').value.trim()
    if (!email) return showMessage('error', 'Email is required')
    showMessage('success', 'Sending reset link...')
    // Supabase v2: sendResetPasswordEmail available via resetPasswordForEmail in older versions.
    // Use signInWithOtp with provider 'email' type 'reset' if available; fall back to auth.resetPasswordForEmail.
    try {
      // try modern method
      const send = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/auth.html'
      })
      if (send.error) {
        showMessage('error', send.error.message || 'Failed to send reset email')
      } else {
        showMessage('success', 'Reset email sent. Check your inbox.')
      }
    } catch (err) {
      console.warn('reset error', err)
      showMessage('error', 'Failed to send reset link. Check Supabase configuration or use Supabase Dashboard to trigger a reset.')
    }
  })

  // Sign out
  document.getElementById('btn-logout').addEventListener('click', async () => {
    await supabase.auth.signOut()
    showMessage('success', 'Signed out')
    setTimeout(() => location.reload(), 400)
  })

  // Auth state — update UI
  async function refreshUser() {
    const { data } = await supabase.auth.getUser()
    const user = data && data.user
    if (user) {
      signedInPanel.style.display = ''
      userEmailEl.textContent = user.email || user.id
      document.getElementById('form-container').style.display = 'block'
      document.querySelectorAll('form').forEach(f => (f.style.display = 'none'))
      signedInPanel.scrollIntoView({ behavior: 'smooth' })
    } else {
      signedInPanel.style.display = 'none'
      switchTo('signin')
    }
  }

  // subscribe to changes
  supabase.auth.onAuthStateChange(() => {
    refreshUser()
  })

  // initial
  document.addEventListener('DOMContentLoaded', refreshUser)
})()
