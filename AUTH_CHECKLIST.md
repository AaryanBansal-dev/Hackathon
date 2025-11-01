# 📋 Supabase Integration Checklist

Complete the following steps to get your app fully working with Supabase auth and data storage.

## ✅ Pre-Deployment Checklist

### 1. Supabase Project Setup
- [ ] Create Supabase account at https://supabase.com
- [ ] Create new project (note the project name)
- [ ] Wait for project to be active (usually takes 1-2 min)
- [ ] Go to **Project Settings** → **API**
- [ ] Copy **Project URL** (format: `https://XXXXX.supabase.co`)
- [ ] Copy **anon public key** (NOT the service role key)

### 2. Update auth-config.js
- [ ] Open `/auth-config.js`
- [ ] Paste Project URL in: `window.SUPABASE_URL = 'YOUR_URL'`
- [ ] Paste anon key in: `window.SUPABASE_ANON_KEY = 'YOUR_KEY'`
- [ ] Save the file
- [ ] Do NOT commit these keys if using public repo (add auth-config.js to .gitignore)

### 3. Create Database Table
- [ ] Go to Supabase dashboard → **SQL Editor**
- [ ] Click **New Query**
- [ ] Open `SUPABASE_SETUP.md` and copy the full SQL
- [ ] Paste in the SQL editor and click **Run**
- [ ] Verify table `health_records` appears in **Table Editor**
- [ ] Verify RLS policies were created (check each policy in Table Editor)

### 4. Test Local Development
- [ ] Start local server:
  ```bash
  python3 -m http.server 8000
  ```
- [ ] Open http://localhost:8000/auth.html
- [ ] **Test Sign-Up**:
  - [ ] Fill email field: `test@example.com`
  - [ ] Fill password field: `TestPassword123`
  - [ ] Click "Create account"
  - [ ] Should see success message or redirect to index.html
  - [ ] Verify in Supabase dashboard → **Authentication** → **Users** that user was created

- [ ] **Test Sign-In**:
  - [ ] Go back to auth.html
  - [ ] Fill same email and password
  - [ ] Click "Sign in"
  - [ ] Should be redirected to index.html
  - [ ] Navbar should show "Signed in as test@example.com"

- [ ] **Test Protected Routes**:
  - [ ] Click "Sign Out" button
  - [ ] Try accessing http://localhost:8000/index.html
  - [ ] Should redirect to auth.html (not signed in)
  - [ ] Sign in again and verify redirect works

### 5. Test Health Form Submission
- [ ] Stay signed in on index.html
- [ ] Fill out "Health Data Form" (all required fields)
- [ ] Click "Submit Health Data"
- [ ] Check Supabase **Table Editor** → `health_records`
- [ ] Verify your data row appears
- [ ] Verify `user_id` and `user_email` match your account

### 6. Test Logout/Session
- [ ] Sign out from index.html
- [ ] Try accessing dashboard.html
- [ ] Should redirect to auth.html
- [ ] Open browser DevTools → **Application** → **Cookies**
- [ ] Verify `sb-XXXXX-auth-token` is NOT present (session cleared)

---

## 🔍 Verification Commands

### Check if Supabase is loaded (Browser Console)
```javascript
// Should return an object with methods
console.log(window.supabase)

// Should return your URL
console.log(window.SUPABASE_URL)

// Should return your anon key
console.log(window.SUPABASE_ANON_KEY)

// Should return current user (if signed in)
window.supabaseAuth.getCurrentUser().then(user => console.log(user))
```

### Check auth state (Browser Console)
```javascript
// Get current session
window.supabaseAuth.getSession().then(session => console.log(session))

// Sign out
window.supabaseAuth.signOut().then(() => console.log('Signed out'))
```

---

## ⚠️ Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| "Please configure your Supabase keys" | Missing/wrong keys in `auth-config.js` | Copy keys from Supabase dashboard again |
| Sign-up fails silently | Keys are wrong | Verify exact match in `auth-config.js` |
| Redirects to auth.html immediately | User not recognized | Sign up with new email, refresh page |
| Health form not storing data | Not signed in OR RLS policy blocked | Check navbar "Signed in as", verify RLS |
| Can't create user in Supabase | Email already exists | Use different email for sign-up |
| Cookies not persisting | Using file:// protocol | Use local server (http://localhost) |

---

## 📊 Database Schema

Your `health_records` table includes:

**User Association:**
- `user_id` (UUID) - Links to Supabase auth user
- `user_email` (TEXT) - For reference

**Vital Signs:**
- `blood_pressure_systolic`, `blood_pressure_diastolic`, `heart_rate`, `oxygen_saturation`, `temperature`

**Lab Reports:**
- `hemoglobin`, `blood_sugar_fasting`, `blood_sugar_pp`, `cholesterol_total`, `hdl`, `ldl`, `triglycerides`, `vitamin_d`, `vitamin_b12`, `calcium`, `thyroid_tsh`, `thyroid_t3`, `thyroid_t4`

**Lifestyle:**
- `daily_steps`, `average_sleep_hours`, `calories_intake`, `water_intake`, `workout_frequency`

**Medical History:**
- `known_conditions`, `medications`, `allergies`, `family_history`

**Report Upload:**
- `report_file_name`, `report_date`, `report_type`, `parsed_text`

**Metadata:**
- `overall_health_score`, `created_at`, `updated_at`

**Security:**
- All records protected by RLS (users can only see/edit their own)

---

## 🚀 Production Checklist (Before Deploying)

- [ ] Auth keys are in `auth-config.js` (NOT hardcoded elsewhere)
- [ ] Add `auth-config.js` to `.gitignore` if using Git
- [ ] Test signup/signin on production domain
- [ ] Test form submission and data storage
- [ ] Test logout and session expiry
- [ ] Enable HTTPS for production (required for Supabase auth)
- [ ] Configure allowed redirect URLs in Supabase:
  - Go to **Project Settings** → **Auth** → **URL Configuration**
  - Add your production domain
- [ ] Test from different browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices
- [ ] Verify no console errors in DevTools

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **Supabase Auth**: https://supabase.com/docs/guides/auth
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **n8n Integration** (for AI insights): See `README.md`

---

## ✨ Features Implemented

✅ Sign Up (email + password)
✅ Sign In (email + password)
✅ Sign Out (logout with session clear)
✅ Password Reset (send reset email)
✅ Protected Pages (redirect if not authenticated)
✅ User Session Display (navbar shows email)
✅ Health Data Storage (Supabase table)
✅ Row Level Security (users only see own data)
✅ Responsive Auth UI (mobile + desktop)

---

## 🎓 How Data Flows

```
User Signs Up (auth.html)
  ↓
Supabase Auth creates user account
  ↓
Session token stored in browser
  ↓
Redirect to index.html
  ↓
Auth check verifies session
  ↓
Navbar displays "Signed in as [email]"
  ↓
User fills health form
  ↓
Click "Submit"
  ↓
Form validates, collects data
  ↓
Data sent to:
  ├─ Supabase (health_records table) → Stored with user_id
  └─ n8n webhook (optional) → Processes with AI
  ↓
Response shows success
  ↓
Data visible in Supabase dashboard
```

---

## 📝 Important Notes

1. **Anon Key is Public** — The `SUPABASE_ANON_KEY` is safe to use in frontend code. RLS policies ensure users can only access their own data.

2. **No Server Needed** — This is a pure frontend implementation. Supabase handles all backend auth and database logic.

3. **HTTPS Required** — Some features like password reset email links may not work on `http://` (localhost is OK for development).

4. **Session Persistence** — Auth session is stored in browser storage. Closing the browser may clear it depending on settings.

5. **Rate Limiting** — Supabase has rate limits. Sign-ups/logins are rate limited per IP to prevent abuse.

---

## ✅ Mark Completed When Done

- [ ] All keys configured
- [ ] Database table created
- [ ] Sign-up tested
- [ ] Sign-in tested
- [ ] Protected routes working
- [ ] Health data storing correctly
- [ ] Sign-out working
- [ ] Ready for production deployment

**Congratulations! Your Supabase integration is complete!** 🎉
