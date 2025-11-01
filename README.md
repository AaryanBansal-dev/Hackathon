# Health Tracking Dashboard

A comprehensive health tracking website with form submission, n8n webhook integration, AI-powered insights, and data visualization.

## Features

- 📊 **Health Metrics Tracking**: Track vital signs, lab reports, lifestyle data, and medical history
- 🎯 **Auto-calculated Metrics**: BMI and overall health score calculated automatically
- 🗣️ **Voice Input**: Web Speech API integration for hands-free data entry
- 📈 **Data Visualization**: Chart.js integration for visual health metric analysis
- 🔗 **n8n Integration**: Seamless webhook integration for automation workflows
- 🤖 **AI Insights**: Support for AI-generated health predictions and recommendations

## Field Categories

| **Category**                             | **Field Name**                                                                                            | **Description / Usage**                                           |
| ---------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **User Info**                            | `user_id`                                                                                                 | Unique user identifier (from Supabase)                            |
|                                          | `age`, `gender`, `height`, `weight`, `BMI`                                                                | Base stats for all health insights                                |
| **Vital Signs**                          | `blood_pressure_systolic`, `blood_pressure_diastolic`                                                     | For hypertension risk prediction                                  |
|                                          | `heart_rate`                                                                                              | For resting heart health                                          |
|                                          | `oxygen_saturation`                                                                                       | For respiratory analysis                                          |
|                                          | `temperature`                                                                                             | For early fever or infection signs                                |
| **Lab Reports (Parsed from PDF)**        | `hemoglobin`, `blood_sugar_fasting`, `blood_sugar_pp`, `cholesterol_total`, `HDL`, `LDL`, `triglycerides` | Common preventive markers for diabetes and heart disease          |
|                                          | `vitamin_d`, `vitamin_b12`, `calcium`, `thyroid_TSH`, `thyroid_T3`, `thyroid_T4`                          | Nutritional and hormonal balance indicators                       |
| **Lifestyle Data (From App)**            | `daily_steps`, `average_sleep_hours`, `calories_intake`, `water_intake`, `workout_frequency`              | Context for AI correlations and insights                          |
| **Medical History**                      | `known_conditions`                                                                                        | e.g., "Diabetes Type 2", "Asthma"                                 |
|                                          | `medications`                                                                                             | Names and frequency (optional)                                    |
|                                          | `allergies`                                                                                               | For meal and diet suggestions                                     |
|                                          | `family_history`                                                                                          | Optional — hereditary risk mapping                                |
| **AI-Generated Insights (n8n → Gemini)** | `risk_prediction`                                                                                         | Output like "High cholesterol risk" or "Iron deficiency detected" |
|                                          | `preventive_suggestions`                                                                                  | AI-generated diet, lifestyle, or check-up recommendations         |
|                                          | `trend_summary`                                                                                           | e.g., "Blood sugar increasing by 5% weekly"                       |
| **Uploads**                              | `report_file_name`, `report_date`, `report_type`, `parsed_text`                                           | Metadata for uploaded reports                                     |
| **Health Index**                         | `overall_health_score` (0–100)                                                                            | Weighted score combining all metrics for quick view               |

## Tech Stack

- **HTML5**: Semantic markup structure
- **CSS3**: Modern responsive styling with animations
- **JavaScript (ES6+)**: Form handling, calculations, and API integrations
- **Chart.js**: Data visualization and health metrics charts
- **Web Speech API**: Voice input functionality
- **Fetch API**: HTTP requests to n8n webhook
- **n8n**: Automation and workflow orchestration
- **Supabase**: User authentication and database (optional)

## Setup Instructions

### 1. Local Setup

1. **Clone or download** this repository
2. **Open** `index.html` in a modern web browser
   - For best experience, use a local server (see below)

#### Using a Local Server (Recommended)

**Python:**
```bash
# Python 3
python -m http.server 8000

# Then open http://localhost:8000 in your browser
```

**Node.js:**
```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000

# Then open http://localhost:8000 in your browser
```

**VS Code Live Server:**
- Install "Live Server" extension
- Right-click on `index.html` → "Open with Live Server"

### 2. n8n Webhook Integration

**🎉 Easy Integration**: The website now includes a built-in configuration UI! No need to edit code files manually.

#### Quick Start Guide

1. **Set up your n8n workflow** (see detailed steps below)
2. **Get your webhook URL** from n8n
3. **Open the website** and click on **"n8n Setup"** in the navigation
4. **Paste your webhook URL** in the configuration form
5. **Click "Save Configuration"**
6. **Start using the form** - your data will automatically be sent to n8n!

---

#### Step 1: Create n8n Workflow (Detailed)

##### 1.1: Access n8n

1. **Log in** to your n8n instance:
   - **n8n Cloud**: https://app.n8n.io
   - **Self-hosted**: Your n8n URL (e.g., `https://n8n.yourdomain.com`)

##### 1.2: Create New Workflow

1. Click **"+ New Workflow"** or **"Workflows"** → **"Add Workflow"**
2. Give your workflow a name (e.g., "Health Tracker Integration")

##### 1.3: Add Webhook Trigger Node

1. Click the **"+ Add Node"** button or drag from the node panel
2. Search for **"Webhook"** and select it
3. **Configure the Webhook node:**
   - **HTTP Method**: Select `POST` (required)
   - **Path**: Enter a path like `/webhook/health-data`
   - **Response Mode**: Select `"Using 'Respond to Webhook' Node"` (Important!)
   - Click **"Execute Node"** to activate the webhook and get the URL
4. **Copy the webhook URL** - It will look like:
   - `https://your-n8n-instance.com/webhook/health-data` (self-hosted)
   - `https://your-username.app.n8n.cloud/webhook/health-data` (n8n Cloud)

⚠️ **Important**: Make sure your workflow is **ACTIVE** (toggle in top-right). The webhook won't work if the workflow is inactive.

---

#### Step 2: Build Your Workflow (Recommended Structure)

Add nodes to process the health data. Here's a complete workflow example:

##### 2.1: Webhook Node (Already Added)
- Receives POST requests from the health form
- Data will be available as `$json` in subsequent nodes

##### 2.2: Code Node (Optional - Data Validation)

1. Add a **Code** node after the Webhook
2. Select **JavaScript** as the language
3. Add validation logic:
```javascript
const data = $input.item.json;

// Basic validation
if (!data || Object.keys(data).length === 0) {
  throw new Error('No data received');
}

// Log received data (optional - for debugging)
console.log('Received health data:', data);

return { json: data };
```

##### 2.3: Supabase Node (Optional - Store Data)

If you want to store data in Supabase:

1. Add a **Supabase** node (requires Supabase account)
2. Configure connection:
   - **Project URL**: Your Supabase project URL
   - **API Key**: Your Supabase anon/public key
3. Set operation:
   - **Operation**: `Insert`
   - **Table**: `health_records` (create this table first)
   - **Columns**: Map form fields to your table columns

##### 2.4: AI Insights with Gemini (Recommended)

To generate AI-powered health insights:

1. Add an **HTTP Request** node
2. Configure it:
   - **Method**: `POST`
   - **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_GEMINI_API_KEY`
   - **Headers**: 
     - `Content-Type: application/json`
   - **Body** (JSON):
```json
{
  "contents": [{
    "parts": [{
      "text": "Analyze this health data and provide:\n1. Risk Prediction (specific health risks)\n2. Preventive Suggestions (diet, lifestyle, check-ups)\n3. Trend Summary (if data shows trends)\n\nHealth Data:\n{{ JSON.stringify($json) }}\n\nRespond in JSON format: {\"risk_prediction\": \"...\", \"preventive_suggestions\": \"...\", \"trend_summary\": \"...\"}"
    }]
  }]
}
```

3. **Get Gemini API Key**:
   - Go to https://ai.google.dev/
   - Click "Get API Key"
   - Create a new key
   - Replace `YOUR_GEMINI_API_KEY` in the URL above

##### 2.5: Function Node (Process AI Response)

1. Add a **Function** node after the Gemini HTTP Request
2. Parse the AI response:
```javascript
const aiResponse = $input.item.json;

// Extract the text from Gemini response
let text = '';
if (aiResponse.candidates && aiResponse.candidates[0]) {
  text = aiResponse.candidates[0].content.parts[0].text;
}

// Try to parse JSON if AI returned JSON
let insights = {
  risk_prediction: 'No specific risks detected',
  preventive_suggestions: 'Maintain current healthy lifestyle',
  trend_summary: 'Data shows normal patterns'
};

try {
  // Remove markdown code blocks if present
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonText = jsonMatch ? jsonMatch[1] : text;
  insights = JSON.parse(jsonText);
} catch (e) {
  // If not JSON, use the text as suggestions
  insights.preventive_suggestions = text;
}

// Merge with original health data
return {
  json: {
    ...$('Webhook').item.json,
    ...insights
  }
};
```

##### 2.6: Respond to Webhook Node (Required)

1. Add a **Respond to Webhook** node at the end
2. Configure:
   - **Respond With**: `JSON`
   - **Response Code**: `200`
   - **Response Body** (JSON):
```json
{
  "success": true,
  "risk_prediction": "{{ $json.risk_prediction }}",
  "preventive_suggestions": "{{ $json.preventive_suggestions }}",
  "trend_summary": "{{ $json.trend_summary }}",
  "overall_health_score": {{ $json.overall_health_score || 0 }}
}
```

3. **Connect all nodes** in sequence: Webhook → Code → [Supabase] → [Gemini] → Function → Respond to Webhook

##### 2.7: Activate Workflow

1. Click the **"Active"** toggle in the top-right corner of the n8n editor
2. Your workflow is now live and listening for webhook requests!

---

#### Step 3: Configure Webhook URL in Website (Easy Method)

**🎯 No Code Editing Required!**

1. **Open** the Health Tracker website in your browser
2. **Navigate** to the **"n8n Setup"** section (use the navigation menu or scroll to the top)
3. **Paste your webhook URL** in the input field:
   - The URL should look like: `https://your-n8n-instance.com/webhook/health-data`
4. **Click "Save Configuration"** - The URL is saved in your browser's local storage

**Status Indicator**: You'll see a green dot with "Configured" when the webhook URL is set correctly.

---

#### Step 4: Use the Integration

1. **Fill out** health data in the **"Health Data Form"** section
2. **Click "Submit Health Data"**
3. **Check the results**:
   - **Website**: You should see a success message and AI insights (if configured)
   - **n8n**: Go to your workflow execution logs to see the received data
4. **Verify AI Insights** appear in the **"AI-Generated Insights"** section:
   - Risk Prediction
   - Preventive Suggestions  
   - Trend Summary

---

#### Alternative: Manual Configuration (If needed)

If you prefer to edit code files directly:

1. **Open** `script.js`
2. **Find** the `getN8NWebhookUrl()` function (around line 2)
3. You can modify it to return a hardcoded URL, or use the UI method above (recommended)

The UI method is recommended because:
- ✅ No code editing required
- ✅ Easy to change URLs
- ✅ Works across different browsers/devices

### 3. n8n Workflow Example Structure

```
┌─────────────┐
│   Webhook   │ (Trigger - receives POST from form)
└──────┬──────┘
       │
┌──────▼──────┐
│    Code     │ (Optional - data validation/transformation)
└──────┬──────┘
       │
┌──────▼──────┐
│  Supabase   │ (Store data in database)
└──────┬──────┘
       │
┌──────▼──────┐
│   Gemini    │ (Generate AI insights)
│  / HTTP     │
└──────┬──────┘
       │
┌──────▼──────────────┐
│ Function / Code     │ (Format AI response)
└──────┬──────────────┘
       │
┌──────▼──────────────┐
│ Respond to Webhook  │ (Return insights to website)
└─────────────────────┘
```

### 4. Supabase Integration (Optional)

If you want to integrate with Supabase:

1. **Create a Supabase project** at https://supabase.com
2. **Create a table** `health_records` with columns matching your form fields
3. **Get your Supabase credentials**:
   - Project URL
   - API Key (anon/public key)
4. **In n8n**, use the Supabase node:
   - Add connection with your credentials
   - Configure insert/update operation
   - Map form fields to table columns

### 5. Google Gemini Integration (Optional)

To generate AI insights using Google Gemini:

1. **Get Gemini API Key**:
   - Go to https://ai.google.dev/
   - Create API key
2. **In n8n**, use HTTP Request node:
   - **Method**: POST
   - **URL**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`
   - **Headers**: `Content-Type: application/json`
   - **Body**: 
   ```json
   {
     "contents": [{
       "parts": [{
         "text": "Analyze this health data and provide risk predictions, preventive suggestions, and trend summary: {{ $json }}"
       }]
     }]
   }
   ```

## Data Flow

```
User Form Submission
    ↓
JavaScript (script.js)
    ├─ Calculate BMI
    ├─ Calculate Health Score
    └─ Collect Form Data
    ↓
POST to n8n Webhook
    ↓
n8n Workflow
    ├─ Store in Supabase (optional)
    ├─ Send to Gemini API (optional)
    └─ Process AI Response
    ↓
Return AI Insights
    ↓
Update Website UI
    ├─ Display Insights
    └─ Update Charts
```

## Form Data Structure

When submitted, the form sends a JSON payload with the following structure:

```json
{
  "user_id": "string",
  "age": number,
  "gender": "string",
  "height": number,
  "weight": number,
  "BMI": number,
  "blood_pressure_systolic": number,
  "blood_pressure_diastolic": number,
  "heart_rate": number,
  "oxygen_saturation": number,
  "temperature": number,
  "hemoglobin": number,
  "blood_sugar_fasting": number,
  "blood_sugar_pp": number,
  "cholesterol_total": number,
  "HDL": number,
  "LDL": number,
  "triglycerides": number,
  "vitamin_d": number,
  "vitamin_b12": number,
  "calcium": number,
  "thyroid_TSH": number,
  "thyroid_T3": number,
  "thyroid_T4": number,
  "daily_steps": number,
  "average_sleep_hours": number,
  "calories_intake": number,
  "water_intake": number,
  "workout_frequency": number,
  "known_conditions": "string",
  "medications": "string",
  "allergies": "string",
  "family_history": "string",
  "report_file_name": "string",
  "report_date": "string",
  "report_type": "string",
  "parsed_text": "string",
  "overall_health_score": number,
  "submission_date": "ISO 8601 timestamp"
}
```

## Expected n8n Response

The n8n webhook should return a JSON response:

```json
{
  "success": true,
  "risk_prediction": "High cholesterol risk detected",
  "preventive_suggestions": "Consider reducing saturated fat intake and increasing physical activity",
  "trend_summary": "Blood sugar increasing by 5% weekly",
  "overall_health_score": 75
}
```

## Features in Detail

### Auto-Calculations
- **BMI**: Automatically calculated when height and weight are entered
- **Health Score**: Dynamically updated based on all entered metrics (0-100 scale)

### Voice Input
- Click the 🎤 microphone icon next to supported fields
- Speak the value (e.g., "one hundred twenty" for 120)
- The number is automatically extracted and entered

### Data Visualization
- **Health Score Chart**: Doughnut chart showing overall health score
- **Vital Signs Chart**: Bar chart for vital measurements
- **Lab Results Chart**: Line chart for lab test values
- **Lifestyle Chart**: Radar chart for lifestyle metrics

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Touch-friendly interface
- Adaptive layout for different screen sizes

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (voice input requires HTTPS)
- **Opera**: Full support

**Note**: Web Speech API requires HTTPS in production (works on localhost for development)

## Troubleshooting

### Webhook Not Working
- Check if n8n webhook URL is correctly configured in `script.js`
- Verify n8n workflow is active and listening
- Check browser console for error messages
- Ensure CORS is properly configured in n8n

### Voice Input Not Working
- Ensure you're using a supported browser (Chrome, Edge, Firefox, Safari)
- For production, ensure the site is served over HTTPS
- Check microphone permissions in browser settings

### Charts Not Displaying
- Verify Chart.js CDN is loading correctly
- Check browser console for JavaScript errors
- Ensure data is entered in the form fields

### Form Validation Errors
- All required fields (marked with *) must be filled
- Numeric fields must contain valid numbers within specified ranges
- Check for any browser console errors

## Security Considerations

- **Input Validation**: All form inputs are validated client-side
- **HTTPS**: Use HTTPS in production for secure data transmission
- **API Keys**: Store n8n webhook URLs securely (consider environment variables)
- **Data Privacy**: Ensure compliance with healthcare data regulations (HIPAA, GDPR, etc.)
- **CORS**: Configure CORS properly in n8n if accessing from different domains

## License

This project is open source and available for modification and distribution.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review n8n workflow execution logs
3. Check browser console for JavaScript errors
4. Verify all configuration steps are completed correctly
