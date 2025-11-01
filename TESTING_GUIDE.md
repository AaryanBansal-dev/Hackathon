# 🧪 Testing Guide - Sign-In & Sign-Up

This guide walks you through testing the complete authentication flow locally.

## 🎬 Quick Test (5 minutes)

### Step 1: Start Local Server
```bash
cd /home/aaryan/Projects/Hackathon

# Option A: Python (Python 3)
python3 -m http.server 8000

# Option B: Node.js (http-server)
npx http-server -p 8000

# Option C: VS Code Live Server
# Right-click index.html → Open with Live Server
```

Then open: **http://localhost:8000/auth.html**

### Step 2: Sign Up (Test 1)
1. Make sure you're on the **"Sign up"** tab
2. Enter email: `testuser@example.com`
3. Enter password: `TestPassword123` (min 6 chars)
4. Click **"Create account"**

**Expected Result:**
- ✅ Success message appears
- ✅ Redirected to `index.html` (after ~1 second)
- ✅ Navbar shows "Signed in as testuser@example.com"
- ✅ "Sign Out" button is visible

**If it fails:**
- Check browser console (F12 → Console tab)
- Look for error messages
- Verify `auth-config.js` has correct Supabase URL and key

### Step 3: Sign Out
1. Click "Sign Out" button in navbar
2. **Expected Result:**
   - ✅ Message says "Signed out"
   - ✅ Redirected back to `auth.html` after ~0.5 seconds

### Step 4: Sign In (Test 2)
1. You're back at `auth.html`, "Sign in" tab should be active
2. Enter email: `testuser@example.com` (same as signup)
3. Enter password: `TestPassword123` (same as signup)
4. Click **"Sign in"**

**Expected Result:**
- ✅ Message says "Signed in. Redirecting..."
- ✅ Redirected to `index.html`
- ✅ Navbar shows "Signed in as testuser@example.com"

### Step 5: Test Protected Pages
1. While still signed in, open **http://localhost:8000/dashboard.html**
   - ✅ Should load normally (you're authorized)
   - ✅ Navbar shows your email
   
2. Click "Sign Out" on dashboard.html
   - ✅ Redirected to `auth.html`

3. Try opening **http://localhost:8000/index.html** directly (while signed out)
   - ✅ Automatically redirected to `auth.html`

---

## 🔍 Advanced Testing

### Test Failed Sign-Up (Wrong Password)

1. On `auth.html`, Sign up tab
2. Try signing up with same email again: `testuser@example.com`
3. Enter any password

**Expected Result:**
- ✅ Error message: "User already registered"
- ✅ No redirect (stays on auth page)

### Test Sign-In with Wrong Password

1. Click "Sign in" tab (or go back from signup)
2. Enter email: `testuser@example.com`
3. Enter password: `WrongPassword123`
4. Click "Sign in"

**Expected Result:**
- ✅ Error message: "Invalid login credentials" or similar
- ✅ No redirect (stays on auth page)

### Test Sign-In with Non-Existent Email

1. Click "Sign in" tab
2. Enter email: `nonexistent@example.com`
3. Enter any password
4. Click "Sign in"

**Expected Result:**
- ✅ Error message about invalid credentials
- ✅ No redirect

### Test Password Reset (Optional)

1. On "Sign in" tab, click "Forgot password"
2. Enter your email: `testuser@example.com`
3. Click "Send reset link"

**Expected Result:**
- ✅ Message: "Reset email sent. Check your inbox."
- ✅ Check your email for reset link (usually appears in seconds)

**Note:** If you don't receive the email:
- Check spam/junk folder
- Supabase requires email confirmation setup in project settings
- For testing, use your personal email

---

## 📊 Verify Data Storage

### Check User Created in Supabase

1. Go to your Supabase dashboard
2. Click **Authentication** (left sidebar)
3. Click **Users**
4. ✅ You should see your test user: `testuser@example.com`
5. Click on the user to see details (signup time, last login, etc.)

### Check Health Data Stored

1. While signed in as your test user on `index.html`
2. Scroll down to "Health Data Form"
3. Fill out at least these required fields:
   - Blood Pressure Systolic: `120`
   - Blood Pressure Diastolic: `80`
   - Heart Rate: `72`
   - Oxygen Saturation: `98`
   - Temperature: `37`
   - Hemoglobin: `14`
   - Blood Sugar Fasting: `100`
   - Blood Sugar Post-Prandial: `140`
   - Cholesterol Total: `200`
   - HDL: `50`
   - LDL: `100`
   - Triglycerides: `100`
   - Vitamin D: `30`
   - Vitamin B12: `500`
   - Calcium: `9`
   - Thyroid TSH: `2`
   - Thyroid T3: `150`
   - Thyroid T4: `8`
   - Daily Steps: `5000`
   - Average Sleep Hours: `8`
   - Calories Intake: `2000`
   - Water Intake: `2`
   - Workout Frequency: `3`
   - Known Conditions: `None`
   - Medications: `None`
   - Allergies: `None`
   - Family History: `None`
   - Report File Name: `test_report.pdf`
   - Report Date: Pick any date
   - Report Type: Select "Blood Test"

4. Click "Submit Health Data"

**Expected Result:**
- ✅ Success message appears
- ✅ Insights section shows AI-generated data (if n8n webhook is configured)

### View Stored Data in Supabase

1. Go to Supabase dashboard
2. Click **Table Editor** (left sidebar)
3. Click `health_records` table
4. ✅ You should see a row with your submitted data
5. Verify columns contain your values
6. Verify `user_id` matches the user you created

---

## 🛠️ Browser Developer Tools Debugging

### Open DevTools
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I`
- **Firefox**: Press `F12`
- **Safari**: `Cmd+Option+I`

### Check Console for Errors
1. Open DevTools
2. Click **Console** tab
3. Look for any red error messages
4. Try running these commands:

```javascript
// Check Supabase is loaded
console.log('Supabase client:', window.supabase)

// Get current user
window.supabaseAuth.getCurrentUser().then(user => {
  console.log('Current user:', user)
})

// Get current session
window.supabaseAuth.getSession().then(session => {
  console.log('Current session:', session)
})
```

### Check Network Requests
1. Open DevTools
2. Click **Network** tab
3. Refresh page
4. Sign up or sign in
5. Look for requests to:
   - `https://YOUR_PROJECT.supabase.co/auth/v1/signup`
   - `https://YOUR_PROJECT.supabase.co/auth/v1/token`
6. Click each request to see:
   - **Request**: Data sent
   - **Response**: Success/error from Supabase
   - **Status**: Should be 200 (success) or 4xx (error)

### Check Application Storage
1. Open DevTools
2. Click **Application** tab
3. Expand **Cookies**
4. Look for `sb-XXXXX-auth-token` (if signed in)
5. When you sign out, this cookie should disappear

---

## ✅ Test Checklist

Run through these tests and mark complete:

- [ ] **Sign Up**
  - [ ] Can create new account
  - [ ] Redirects to index.html
  - [ ] Navbar shows email
  - [ ] User appears in Supabase dashboard

- [ ] **Sign In**
  - [ ] Can sign in with correct credentials
  - [ ] Redirects to index.html
  - [ ] Wrong password shows error
  - [ ] Wrong email shows error

- [ ] **Sign Out**
  - [ ] Sign out button works
  - [ ] Redirects to auth.html
  - [ ] Session is cleared

- [ ] **Protected Routes**
  - [ ] Can't access index.html when signed out
  - [ ] Can't access dashboard.html when signed out
  - [ ] Can access when signed in

- [ ] **Health Data**
  - [ ] Can submit form when signed in
  - [ ] Data stores in Supabase table
  - [ ] Data linked to correct user

- [ ] **Session Persistence**
  - [ ] Refreshing page keeps you signed in
  - [ ] Closing browser and reopening stays signed in (if cookies enabled)

---

## 🚨 Common Test Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| All redirects to auth.html | Invalid Supabase keys | Check `auth-config.js` again, copy fresh keys |
| "Please configure Supabase keys" error | Missing keys in `auth-config.js` | Fill in SUPABASE_URL and SUPABASE_ANON_KEY |
| Sign-up works but no redirect | Supabase project inactive | Check Supabase dashboard, project status |
| Network errors in DevTools | CORS issue or key invalid | Verify URL/key are exactly correct |
| Form submission fails silently | Not signed in OR RLS policy blocked | Check navbar shows "Signed in as", check Supabase RLS |

---

## 📝 Test Report Template

```
Date: ___________
Tester: ________

SIGN-UP TEST
✅ ❌ Can create account
✅ ❌ Redirects correctly
✅ ❌ Navbar shows email
✅ ❌ User in Supabase

SIGN-IN TEST
✅ ❌ Correct credentials work
✅ ❌ Wrong password fails
✅ ❌ Wrong email fails
✅ ❌ Redirects correctly

SIGN-OUT TEST
✅ ❌ Sign out button works
✅ ❌ Redirects to auth.html
✅ ❌ Session cleared

PROTECTED ROUTES TEST
✅ ❌ Can't access unsigned out
✅ ❌ Can access signed in
✅ ❌ Auto-redirect works

HEALTH FORM TEST
✅ ❌ Submit works
✅ ❌ Data stores in Supabase
✅ ❌ Data linked to user

OVERALL STATUS: PASS ❌ / PASS ✅
```

---

## ✨ Ready to Test!

Everything is set up. Just:
1. Make sure Supabase keys are in `auth-config.js`
2. Start local server: `python3 -m http.server 8000`
3. Open http://localhost:8000/auth.html
4. Follow the test steps above

**Good luck!** 🚀

For issues, check `AUTH_CHECKLIST.md` or `SUPABASE_SETUP.md`.
