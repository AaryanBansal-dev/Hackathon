/**
 * Supabase Helper — shared utility for auth checks and user management
 * Used by all pages (index.html, dashboard.html, etc.) to check auth state
 * and perform common operations like logout, get current user, etc.
 */

;(function () {
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    console.error('Supabase config not loaded. Make sure auth-config.js is included before this script.')
    return
  }

  const supabase = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY)

  // Expose to global scope for use in app pages
  window.supabaseAuth = {
    client: supabase,

    // Get current user
    async getCurrentUser() {
      const { data } = await supabase.auth.getUser()
      return data && data.user ? data.user : null
    },

    // Get session
    async getSession() {
      const { data } = await supabase.auth.getSession()
      return data && data.session ? data.session : null
    },

    // Sign out
    async signOut() {
      return await supabase.auth.signOut()
    },

    // Check if user is authenticated, if not redirect to auth page
    async requireAuth() {
      const user = await this.getCurrentUser()
      if (!user) {
        window.location.href = 'auth.html'
        return null
      }
      return user
    },

    // Subscribe to auth state changes
    onAuthStateChange(callback) {
      return supabase.auth.onAuthStateChange((event, session) => {
        callback(session && session.user ? session.user : null)
      })
    },

    // Insert health record for current user
    async insertHealthRecord(data) {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const { data: inserted, error } = await supabase.from('health_records').insert([
        {
          ...data,
          user_id: user.id,
          user_email: user.email,
          created_at: new Date().toISOString()
        }
      ])

      if (error) throw error
      return inserted
    },

    // Get user's health records
    async getHealthRecords() {
      const user = await this.getCurrentUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('health_records')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    },

    // Update user metadata
    async updateUserMetadata(metadata) {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata
      })
      if (error) throw error
      return data
    }
  }
})()
