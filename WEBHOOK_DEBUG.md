# 🔍 n8n Webhook Diagnostic Guide

## Possible Issues & Solutions

Your webhook URL is:
```
https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1
```

### Issue #1: Webhook Path Format
**The path might need to be in a different format for n8n cloud.**

n8n cloud webhooks typically use:
```
https://your-instance.app.n8n.cloud/webhook/unique-id
```
OR
```
https://your-instance.app.n8n.cloud/webhook-test/unique-id
```

**Your URL looks correct**, but check these:

1. ✓ Does it start with `https://`? (Not `http://`)
2. ✓ Does it have your correct n8n cloud domain?
3. ✓ Is the webhook ID correct?
4. ✓ Is the path exactly as shown in n8n?

### Issue #2: Webhook Not Active in n8n
**The webhook path must be ACTIVE in your n8n workflow.**

Check in n8n:
1. Go to your workflow
2. Click the **Webhook node**
3. Verify the **path** matches exactly
4. Toggle the workflow to **ACTIVE** (blue toggle)
5. The webhook URL shown should match your frontend URL

### Issue #3: Response Node Missing or Wrong
**n8n must have a Respond to Webhook node.**

In your n8n workflow:
```
Webhook Node
    ↓
[Your other nodes]
    ↓
Respond to Webhook Node ← REQUIRED!
```

The "Respond to Webhook" node must be connected for the webhook to send back a response.

### Issue #4: Wrong HTTP Method
**The Webhook node must be set to POST.**

In n8n Webhook node settings:
- HTTP Method: **POST** ✓ (not GET)
- Authentication: **None** ✓
- Response Mode: **Using Respond to Webhook Node** ✓

---

## ✅ Quick Verification Steps

### Step 1: Verify the Webhook URL is Correct
Open a new tab and test with curl (copy to terminal):

```bash
curl -X POST 'https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1' \
  -H 'Content-Type: application/json' \
  -d '{"test": true, "message": "Testing webhook"}'
```

**Expected**: Response from n8n (could be error, but should be a response)
**Problem**: No response = webhook is inactive or URL is wrong

### Step 2: Check n8n Execution Logs
1. Go to n8n workflow
2. Click **"Execution History"**
3. Look for your test request
4. If nothing appears, webhook isn't being hit

### Step 3: Verify n8n Workflow is ACTIVE
In n8n:
- Top right corner should show **blue toggle** (Active)
- If it's gray/inactive, click to activate
- Inactive workflows won't receive webhook requests

---

## 🔧 How to Fix (Step by Step)

### Fix #1: Correct the Webhook Path (if needed)

In n8n Webhook node, the full URL will be shown. **Copy it exactly.**

Then in your frontend `script.js`, line 4:
```javascript
const N8N_WEBHOOK_URL = 'PASTE_EXACT_URL_FROM_N8N';
```

### Fix #2: Ensure Workflow is Active

1. Go to n8n workflow
2. Click **Active** toggle (top right)
3. It should turn **BLUE**
4. You should see: "Workflow is now active"

### Fix #3: Add Response Node

If you don't have a "Respond to Webhook" node:

1. Click **"+ Add Node"**
2. Search for **"Respond"**
3. Select **"Respond to Webhook"**
4. Connect it to the end of your workflow
5. Configure response body (JSON)

Example response body:
```json
{
  "success": true,
  "risk_prediction": "No specific risks detected",
  "preventive_suggestions": "Maintain healthy lifestyle",
  "trend_summary": "Data looks normal",
  "overall_health_score": 85
}
```

### Fix #4: Enable Webhooks in n8n Settings

1. Go to **Settings** → **Community Nodes**
2. Ensure webhooks are enabled
3. If you have a self-hosted n8n, check the `.env` file

---

## 📊 Testing Workflow

### Test 1: Direct cURL Test
```bash
curl -v -X POST 'https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1' \
  -H 'Content-Type: application/json' \
  -d '{"blood_pressure_systolic": 120, "test": true}'
```

**Watch for:**
- `< HTTP/1.1 200 OK` = Success!
- `< HTTP/1.1 404 Not Found` = Wrong URL
- `< HTTP/1.1 405 Method Not Allowed` = Wrong method (should be POST)
- No response = Webhook inactive

### Test 2: Browser Console Test
1. Open website in browser
2. Press **F12** to open DevTools
3. Go to **Console** tab
4. Run this command:
```javascript
fetch('https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: true, time: new Date().toISOString() })
}).then(r => {
  console.log('Status:', r.status);
  return r.json();
}).then(data => console.log('Response:', data))
.catch(err => console.error('Error:', err));
```

**You should see:**
```
Status: 200
Response: { success: true, ... }
```

### Test 3: Form Submission with Debug
1. Open website
2. Fill in form (at least 1 field)
3. Open DevTools (F12)
4. Go to **Console** tab
5. Click **"Submit Health Data"**
6. Watch console output

**You should see:**
```
=== WEBHOOK DEBUG ===
Sending data to webhook: https://...
Data: {...}
Content-Type: application/json
=== RESPONSE DEBUG ===
Response status: 200
Response statusText: OK
```

---

## 🚨 Common Problems & Solutions

### Problem: "Failed to fetch"
**Possible Causes:**
- Network error
- Webhook URL is unreachable
- n8n instance is down

**Solution:**
1. Test URL in browser (paste in address bar)
2. Try with curl from terminal
3. Check if n8n instance is running
4. Check your internet connection

### Problem: "404 Not Found"
**Possible Causes:**
- Wrong webhook URL
- Wrong path in n8n
- Webhook doesn't exist

**Solution:**
1. Copy URL directly from n8n workflow
2. Make sure it matches exactly
3. Don't manually type it

### Problem: "405 Method Not Allowed"
**Possible Causes:**
- n8n webhook is set to GET instead of POST
- Wrong HTTP method

**Solution:**
1. Go to n8n Webhook node
2. Check HTTP Method: should be **POST**
3. Save and test again

### Problem: "Webhook receives requests but response never returns"
**Possible Causes:**
- No "Respond to Webhook" node
- Response node not connected
- Response node is after workflow error

**Solution:**
1. Check for "Respond to Webhook" node
2. Ensure it's connected at the end
3. Check for errors in workflow (red nodes)

### Problem: No requests appear in n8n Execution History
**Possible Causes:**
- Webhook is not active (toggle is gray)
- URL is wrong
- Network firewall is blocking requests

**Solution:**
1. Check workflow is **ACTIVE** (blue toggle)
2. Verify exact webhook URL matches
3. Test with curl to see if reaching n8n

---

## 🔗 n8n Cloud Webhook Setup

For n8n Cloud, webhooks are typically structured as:

**Format 1 (Standard):**
```
https://your-instance.app.n8n.cloud/webhook/your-unique-id
```

**Format 2 (With Test Path):**
```
https://your-instance.app.n8n.cloud/webhook-test/your-unique-id
```

**Your URL:**
```
https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1
```

✅ This format looks **correct for n8n cloud**!

---

## 🎯 What to Check Right Now

1. **Is your n8n workflow ACTIVE?**
   - Go to workflow
   - Look for blue toggle (Active) in top-right
   - If gray, click to activate

2. **Does your webhook have a Respond node?**
   - Flow should end with "Respond to Webhook"
   - Check if it's connected

3. **Is the webhook method set to POST?**
   - Webhook node → HTTP Method: POST

4. **Is the webhook path correct?**
   - Copy URL from n8n
   - Paste into frontend
   - Make sure it matches exactly

5. **Try the curl command above**
   - Test directly with curl
   - See if you get any response

---

## 📝 Debug Output to Look For

When you submit the form, the console should show:

```javascript
=== WEBHOOK DEBUG ===
Sending data to webhook: https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1
Data: {
  "blood_pressure_systolic": 120,
  ...
}
Content-Type: application/json
=== RESPONSE DEBUG ===
Response status: 200
Response statusText: OK
Response headers: {...}
Response text (raw): {"success":true,...}
Response JSON: {success: true, ...}
✅ Request successful!
```

If you don't see this, the request isn't being sent. If you see a different status (404, 405, etc.), there's a webhook configuration issue.

---

## 🆘 If Still Not Working

**Tell me what you see in the console when you submit:**
1. Error message
2. Status code
3. Response text
4. Whether execution appears in n8n

I can then help debug based on the actual error.
