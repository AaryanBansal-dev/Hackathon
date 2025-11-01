# 🔐 Supabase Authentication Setup Guide

This guide will help you set up the complete authentication system with Supabase.

## 📋 Prerequisites

Before you begin, make sure you have:
- A Supabase account (free tier available at https://supabase.com)
- This project files locally

## 🚀 Step-by-Step Setup

### Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or sign in if you already have an account
3. Create a new project:
   - **Project Name**: NutriVoice (or your preferred name)
   - **Password**: Choose a strong password
   - **Region**: Select the closest region to your users
4. Wait for the project to be created (takes 2-3 minutes)

### Step 2: Get Your API Credentials

1. In your Supabase project, go to **Settings** (bottom left corner)
2. Click on **API** in the left sidebar
3. You'll see:
   - **Project URL** - Copy this
   - **Anon Key** (under "Project API keys") - Copy this

### Step 3: Configure the Authentication

1. Open `auth-config.js` in your text editor
2. Replace the placeholder values:

```javascript
const SUPABASE_CONFIG = {
    url: 'YOUR_PROJECT_URL_HERE',        // Paste your Project URL
    anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'  // Paste your Anon Key
};
```

**Example:**
```javascript
const SUPABASE_CONFIG = {
    url: 'https://your-project-name.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
};
```

3. Save the file

### Step 4: Enable Email Authentication

1. In your Supabase project, go to **Authentication** in the left sidebar
2. Click on **Providers**
3. Make sure **Email** is enabled (it should be by default)
4. Keep the default settings

### Step 5: Test the System

1. Open `auth.html` in your browser
2. You should see the login/signup page
3. Try creating a new account:
   - Use a test email address
   - Create a strong password (uppercase, lowercase, number, special char)
   - Accept the terms and conditions
4. Check your email for confirmation link (if email verification is enabled)
5. Sign in with your credentials

## 🔑 Password Requirements

The system requires strong passwords:
- ✅ At least 8 characters
- ✅ One uppercase letter (A-Z)
- ✅ One lowercase letter (a-z)
- ✅ One number (0-9)
- ✅ One special character (!@#$%^&*)

**Example:** `MyPassword123!`

## 🛡️ Important Security Notes

### Frontend vs Backend

⚠️ **Important**: The `anonKey` is safe to expose in frontend code because:
- It only has read/write permissions you set in Row Level Security (RLS)
- The service role secret is what needs to be protected (keep it backend only)
- All data operations should be protected by RLS policies

### Database Security (Optional but Recommended)

For production, you should:

1. Enable Row Level Security (RLS) on your tables:
   - Go to **SQL Editor** in Supabase
   - Run this to protect user data:

```sql
-- Create a users profile table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id),
  email VARCHAR(255),
  full_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own data
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own data
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
```

2. Verify RLS is enabled in **Authentication > Policies**

## 📱 Using the Authentication System

### Login Page (`auth.html`)

Features:
- Email and password login
- Create new account
- Password reset via email
- Remember me functionality
- Real-time password strength indicator
- Validation messages

### Integrated with Dashboard

Once logged in, users are automatically redirected to `dashboard.html`

To protect pages:
```javascript
// Add this at the top of any protected page's script
document.addEventListener('DOMContentLoaded', async () => {
    const isLoggedIn = await requireAuth('auth.html');
    if (!isLoggedIn) return;
    
    // Your page code here
});
```

### Global Functions Available

```javascript
// Check if user is logged in
const isLoggedIn = await window.isUserLoggedIn();

// Get current user email
const email = window.getCurrentUserEmail();

// Get current user name
const name = window.getCurrentUserName();

// Logout user
window.logout();
```

## 🔄 Email Verification (Optional)

To enable email confirmation on signup:

1. Go to Supabase **Authentication > Settings**
2. Under "Email Confirmations":
   - Toggle **Email Confirmations** ON
   - Set appropriate redirect URL

Users will receive a confirmation email and must click it before they can sign in.

## 🔐 Password Reset Email

The password reset automatically works:

1. User clicks "Forgot password?" on login page
2. Enters their email address
3. Supabase sends a password reset link
4. User clicks the link to create a new password

## 🧪 Testing Checklist

- [ ] Create a new account
- [ ] Receive confirmation email (if enabled)
- [ ] Sign in with credentials
- [ ] See user redirected to dashboard
- [ ] Click logout from dashboard
- [ ] See redirect back to auth page
- [ ] Try invalid credentials (error message appears)
- [ ] Test remember me functionality
- [ ] Test password strength indicator
- [ ] Test forgot password flow

## 📞 Troubleshooting

### Issue: "Supabase Configuration Required" Modal

**Solution**: 
- Check that you've correctly filled in `auth-config.js`
- Verify the URL and key are correctly copied
- Make sure there are no extra spaces

### Issue: Cannot create account

**Possible causes**:
- Email already registered
- Password doesn't meet requirements
- Email confirmation is taking time

**Solution**:
- Check browser console (F12) for error messages
- Try a different email address
- Check your email's spam folder for confirmation links

### Issue: Cannot sign in

**Possible causes**:
- Incorrect credentials
- Account not email-confirmed (if enabled)
- Session expired

**Solution**:
- Double-check email and password
- Check email for confirmation link
- Try refreshing the page

### Issue: No emails being received

**Solution**:
- Check spam/junk folders
- Verify email address was typed correctly
- Check Supabase logs in **Authentication > Logs**

## 🚀 Advanced: Integration with n8n

To send data to n8n when users sign up:

1. Create an n8n workflow that listens to webhooks
2. Add this to `auth.js` after successful signup:

```javascript
// After successful signup, send data to n8n
const webhookUrl = 'your-n8n-webhook-url';
await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        event: 'user_signup',
        email: email,
        fullName: fullName,
        timestamp: new Date().toISOString()
    })
});
```

## 📚 Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [JavaScript Auth Client](https://supabase.com/docs/reference/javascript/auth-signinwithpassword)

## ✅ Next Steps

1. ✅ Secure your credentials
2. ✅ Test the authentication flow
3. ✅ Protect your dashboard pages
4. ✅ Add user profile pages
5. ✅ Implement role-based access control
6. ✅ Add social login (optional)

---

**Need help?** Check the Supabase docs or test in the browser console (F12) for detailed error messages.
