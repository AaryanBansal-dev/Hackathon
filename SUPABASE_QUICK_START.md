# 🚀 Supabase Auth Integration - Complete Setup

Your NutriVoice app is now fully integrated with Supabase for authentication and data storage!

## ✅ What's Been Set Up

### Authentication System
- **Sign Up** — Email + password registration via Supabase Auth
- **Sign In** — Email + password login with session management
- **Sign Out** — Logout button in navbar (index.html, dashboard.html)
- **Password Reset** — "Forgot Password" option on auth page
- **Session Protection** — All app pages require authentication; unauthenticated users are redirected to auth.html

### Files Created/Modified
- ✅ `auth.html` — Complete login/signup page with Supabase integration
- ✅ `auth.js` — Auth flows (signup, signin, signout, session management)
- ✅ `auth-style.css` — Responsive styling for auth page
- ✅ `auth-config.js` — Placeholder for your Supabase credentials
- ✅ `supabase-helper.js` — Shared utility functions for all pages to interact with Supabase
- ✅ `index.html` — Updated with auth check, user info display, sign-out button
- ✅ `dashboard.html` — Updated with auth check, user info display, sign-out button
- ✅ `landing.html` — Updated with "Get Started" buttons that route to auth.html or app
- ✅ `SUPABASE_SETUP.md` — Complete setup guide with SQL and troubleshooting

---

## 🔧 Quick Start (3 Steps)

### Step 1: Get Your Supabase Keys
1. Go to https://supabase.com → Sign Up / Log In
2. Create a new project
3. Go to **Project Settings** → **API**
4. Copy your:
   - **Project URL** (e.g., `https://abcd1234.supabase.co`)
   - **anon public Key**

### Step 2: Add Keys to Your Project
1. Open `auth-config.js`
2. Replace the placeholders:
   ```javascript
   window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   window.SUPABASE_ANON_KEY = 'your-anon-public-key';
   ```
3. Save the file

### Step 3: Set Up Supabase Database
1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the SQL from `SUPABASE_SETUP.md` and run it
4. ✅ Your `health_records` table is ready!

---

## 🎯 Testing the Auth Flow

### 1. Start a Local Server
```bash
# From project root
python3 -m http.server 8000
# or
http-server -p 8000
```

Then open `http://localhost:8000/auth.html`

### 2. Sign Up
- Click "Sign up" tab
- Enter email (e.g., `test@example.com`)
- Enter password (min 6 chars)
- Click "Create account"
- ✅ You should be redirected to `index.html` signed in

### 3. Verify Sign-In
- You'll see "Signed in as test@example.com" in the navbar
- "Sign Out" button is visible
- Click any app page (they all require auth)
- ✅ You stay on the page (authorized)

### 4. Test Sign-Out
- Click "Sign Out" button
- ✅ You'll be redirected to `auth.html`
- Try accessing `index.html` directly
- ✅ You'll be auto-redirected to `auth.html` (not signed in)

### 5. Sign In
- Use same email/password from sign-up
- ✅ Should be redirected to `index.html` signed in

---

## 📊 Using the Health Form

Once signed in on `index.html`:

1. Fill out the "Health Data Form" (all required fields marked with *)
2. Click "Submit Health Data"
3. Your data will be:
   - ✅ Stored in Supabase `health_records` table (linked to your account)
   - ✅ Sent to n8n webhook (if configured for AI insights)
   - ✅ Available for dashboard visualization

To view your stored data:
- Go to Supabase dashboard
- Table Editor → `health_records`
- ✅ You'll see your submitted records

---

## 🔐 Security Features

✅ **Row Level Security (RLS)** — Users can only see/edit their own records
✅ **Session-based Auth** — Automatic redirects for unauthorized access
✅ **Email + Password** — Secure Supabase Auth, passwords never stored in localStorage
✅ **CORS Protected** — API keys are public (anon key) but RLS prevents data access

---

## 🚨 Troubleshooting

**Problem**: "Please configure your Supabase keys"
- **Solution**: Check `auth-config.js` has correct URL and anon key. Check browser console (F12) for errors.

**Problem**: Sign-up/Sign-in not working
- **Solution**: Verify keys are correct, project is active. Try signing up with a new email.

**Problem**: Redirects to auth.html immediately
- **Solution**: Keys might be wrong or Supabase project might be paused. Check dashboard.

**Problem**: Form submission fails silently
- **Solution**: Check if you're signed in (navbar should show "Signed in as..."). Check browser console for errors.

For more help, see `SUPABASE_SETUP.md`.

---

## 📝 File Structure Overview

```
/home/aaryan/Projects/Hackathon/
├── auth.html                   # Login/Signup page
├── auth.js                     # Auth logic (signup, signin, signout)
├── auth-style.css              # Auth page styling
├── auth-config.js              # ⭐ SET YOUR SUPABASE KEYS HERE
├── supabase-helper.js          # Shared auth utilities
├── index.html                  # Main app (protected)
├── dashboard.html              # Dashboard (protected)
├── landing.html                # Landing page
├── script.js                   # Health form logic
├── style.css                   # App styling
├── SUPABASE_SETUP.md          # Full setup guide with SQL
└── SUPABASE_QUICK_START.md    # This file
```

---

## 🎓 How It Works (Architecture)

```
Landing Page (landing.html)
    ↓
    "Get Started" Button → Check if user is signed in
    ├─ YES → Redirect to index.html
    └─ NO → Redirect to auth.html
    
Auth Page (auth.html)
    ├─ Sign Up → Creates new user in Supabase Auth
    ├─ Sign In → Validates email/password
    └─ Forgot Password → Sends reset link
    
Signed-In User
    ↓
    Can Access: index.html, dashboard.html
    ↓
    Fill Health Form → Submit → Stored in Supabase health_records table
    ↓
    Can Sign Out → Redirected back to auth.html
```

---

## 🔗 Next Steps (Optional)

1. **Connect n8n webhook** — Automatically process health data with AI
   - See `README.md` for n8n setup instructions

2. **Add user profile** — Store additional user info (name, age, etc.)
   - Use `window.supabaseAuth.updateUserMetadata({})`

3. **Export health data** — Download as CSV/PDF
   - Use `window.supabaseAuth.getHealthRecords()`

4. **Share records** — Allow users to share health data with doctors
   - Create `health_record_shares` table with permissions

---

## ✨ You're All Set!

Your app now has:
✅ Full authentication (signup, signin, signout, reset password)
✅ Secure data storage with per-user isolation
✅ Protected app pages that redirect unauthenticated users
✅ User session management

**To start using:**
1. Set Supabase keys in `auth-config.js`
2. Create `health_records` table using SQL from `SUPABASE_SETUP.md`
3. Open `auth.html` and test sign-up/sign-in
4. Fill the health form and submit (data stores in Supabase)

Enjoy! 🎉
