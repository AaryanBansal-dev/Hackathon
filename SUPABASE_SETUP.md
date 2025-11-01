# Supabase Setup Guide

## Step 1: Create Your Supabase Project

1. Go to https://supabase.com and sign up / log in
2. Create a new project
3. Once created, go to **Project Settings** → **API** and copy:
   - **Project URL** (e.g., `https://YOUR_PROJECT.supabase.co`)
   - **anon/public Key** (the one labeled "anon")

## Step 2: Add Supabase Keys to Your Project

1. Open `/auth-config.js` in your editor
2. Replace the placeholders:
   ```javascript
   window.SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
   window.SUPABASE_ANON_KEY = 'your-anon-key';
   ```
3. Save the file

## Step 3: Create the Health Records Table

In your Supabase dashboard:

1. Go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Paste this SQL and run it:

```sql
-- Create health_records table
CREATE TABLE health_records (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT,
  
  -- Vital Signs
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  heart_rate INTEGER,
  oxygen_saturation NUMERIC,
  temperature NUMERIC,
  
  -- Lab Reports
  hemoglobin NUMERIC,
  blood_sugar_fasting INTEGER,
  blood_sugar_pp INTEGER,
  cholesterol_total INTEGER,
  hdl INTEGER,
  ldl INTEGER,
  triglycerides INTEGER,
  vitamin_d NUMERIC,
  vitamin_b12 INTEGER,
  calcium NUMERIC,
  thyroid_tsh NUMERIC,
  thyroid_t3 NUMERIC,
  thyroid_t4 NUMERIC,
  
  -- Lifestyle
  daily_steps INTEGER,
  average_sleep_hours NUMERIC,
  calories_intake INTEGER,
  water_intake NUMERIC,
  workout_frequency INTEGER,
  
  -- Medical History
  known_conditions TEXT,
  medications TEXT,
  allergies TEXT,
  family_history TEXT,
  
  -- Report Upload
  report_file_name TEXT,
  report_date DATE,
  report_type TEXT,
  parsed_text TEXT,
  
  -- Health Score
  overall_health_score INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE health_records ENABLE ROW LEVEL SECURITY;

-- Create policy: users can only view their own records
CREATE POLICY "Users can view own health records" ON health_records
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy: users can insert their own records
CREATE POLICY "Users can insert own health records" ON health_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy: users can update their own records
CREATE POLICY "Users can update own health records" ON health_records
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy: users can delete their own records
CREATE POLICY "Users can delete own health records" ON health_records
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_id ON health_records(user_id);
CREATE INDEX idx_created_at ON health_records(created_at DESC);
```

4. The table is now ready!

## Step 4: Test Sign-In / Sign-Up

1. Start a local server:
   ```bash
   python3 -m http.server 8000
   # or
   http-server -p 8000
   ```

2. Open http://localhost:8000/auth.html

3. Try **Sign Up**:
   - Enter an email (e.g., test@example.com)
   - Enter a password (min 6 characters)
   - Click "Create account"
   - If successful, you should be redirected to index.html signed in

4. Try **Sign In**:
   - Go back to auth.html
   - Use the same email/password
   - You should be redirected to index.html

5. In index.html, you'll see "Signed in as test@example.com" and a "Sign Out" button in the navbar

## Step 5: Using the Health Form

1. When logged in on index.html, fill out the health form
2. Click "Submit Health Data"
3. Your data will be:
   - Sent to n8n webhook (if configured)
   - Stored in Supabase `health_records` table
   - Associated with your user account

## Troubleshooting

### "Please configure your Supabase keys"
- Make sure `auth-config.js` has the correct URL and anon key
- Check browser console (F12) for error messages

### Sign-up/Sign-in not working
- Verify your Supabase project is active
- Check that the URL and key are correct
- Try signing up with a new email if the account already exists
- Check Supabase dashboard → Authentication → Users to see created accounts

### Form submission not storing data
- Make sure you're logged in (check navbar for "Signed in as" message)
- Verify the `health_records` table was created correctly
- Check Supabase Table Editor → health_records to see if data is being inserted

### Can't see my health data
- Go to your Supabase dashboard
- Click **Table Editor** (left sidebar)
- Click `health_records`
- You should see rows with your data (filtered to show only your records due to RLS policies)

## What's Next?

Once auth is working:
1. Fill out the health form and submit to test data storage
2. Set up n8n webhook to process health data with AI (optional)
3. Build custom dashboard views to visualize your health metrics
4. Add more features like export, sharing, etc.

For questions, check:
- Supabase docs: https://supabase.com/docs
- n8n docs: https://docs.n8n.io
- Browser console (F12) for JavaScript errors
