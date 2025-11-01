// n8n Webhook Configuration
// This webhook URL will be used to submit health data
// You can change this URL to your actual n8n webhook
const N8N_WEBHOOK_URL = 'https://agrawalaarush10.app.n8n.cloud/webhook-test/d9f36d05-587d-48cb-9976-9f4c961e57c1'; // Change this to your n8n webhook URL

function getN8NWebhookUrl() {
    // Get webhook URL from localStorage or use default
    return localStorage.getItem('n8n_webhook_url') || N8N_WEBHOOK_URL;
}

// Global variables
let recognition = null;
let isRecording = false;
let currentVoiceField = null;
let healthScoreChart = null;
let vitalSignsChart = null;
let labResultsChart = null;
let lifestyleChart = null;

// Initialize Web Speech API
function initSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            isRecording = true;
            updateVoiceStatus('Listening... Speak now.');
            document.getElementById('startRecording').disabled = true;
            document.getElementById('stopRecording').disabled = false;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('voiceTranscript').textContent = transcript;
            
            // Extract number from transcript
            const number = extractNumber(transcript);
            if (number !== null && currentVoiceField) {
                document.getElementById(currentVoiceField).value = number;
                // Trigger change event to update calculations
                document.getElementById(currentVoiceField).dispatchEvent(new Event('input'));
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            updateVoiceStatus('Error: ' + event.error);
            resetVoiceControls();
        };

        recognition.onend = () => {
            isRecording = false;
            resetVoiceControls();
        };
    } else {
        console.warn('Speech recognition not supported in this browser');
    }
}

// Extract number from speech transcript
function extractNumber(transcript) {
    // Remove common words and extract numeric value
    const cleaned = transcript.toLowerCase()
        .replace(/degrees?/g, '')
        .replace(/celsius|fahrenheit|centigrade/g, '')
        .replace(/pounds?|kilos?|kilograms?|grams?/g, '')
        .replace(/centimeters?|cm|inches?/g, '')
        .replace(/beats?|bpm/g, '')
        .replace(/percent|percentage|%/g, '')
        .replace(/millimeters?|mmhg/g, '')
        .trim();
    
    // Extract numbers (including decimals)
    const match = cleaned.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : null;
}

// Voice input handlers
document.addEventListener('DOMContentLoaded', () => {
    initSpeechRecognition();
    
    // Voice button event listeners
    document.querySelectorAll('.voice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const fieldName = btn.getAttribute('data-field');
            openVoiceModal(fieldName);
        });
    });

    // Voice modal controls
    document.getElementById('startRecording')?.addEventListener('click', startRecording);
    document.getElementById('stopRecording')?.addEventListener('click', stopRecording);

    // Close modal on outside click
    document.getElementById('voiceModal')?.addEventListener('click', (e) => {
        if (e.target.id === 'voiceModal') {
            closeVoiceModal();
        }
    });
});

function openVoiceModal(fieldName) {
    currentVoiceField = fieldName;
    const fieldLabel = document.querySelector(`label[for="${fieldName}"]`)?.textContent || fieldName;
    document.getElementById('voiceModal').classList.add('active');
    document.getElementById('voiceStatus').textContent = `Recording for: ${fieldLabel}`;
    document.getElementById('voiceTranscript').textContent = '';
}

function closeVoiceModal() {
    if (isRecording) {
        recognition?.stop();
    }
    document.getElementById('voiceModal').classList.remove('active');
    currentVoiceField = null;
}

function startRecording() {
    if (recognition && !isRecording) {
        recognition.start();
    }
}

function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
    }
}

function resetVoiceControls() {
    document.getElementById('startRecording').disabled = false;
    document.getElementById('stopRecording').disabled = true;
}

function updateVoiceStatus(message) {
    document.getElementById('voiceStatus').textContent = message;
}

// BMI Calculation - Removed (User Info section removed)

// Health Score Calculation (0-100)
function calculateHealthScore() {
    let score = 100;
    let factors = [];

    // BMI Score removed (User Info section removed)

    // Blood Pressure Score (20 points)
    const systolic = parseFloat(document.getElementById('blood_pressure_systolic').value);
    const diastolic = parseFloat(document.getElementById('blood_pressure_diastolic').value);
    if (systolic && diastolic) {
        if (systolic < 120 && diastolic < 80) {
            factors.push({ name: 'Blood Pressure', value: 20, status: 'good' });
        } else if (systolic >= 120 && systolic < 130 && diastolic < 80) {
            score -= 5;
            factors.push({ name: 'Blood Pressure', value: 15, status: 'warning' });
        } else if (systolic >= 130 || diastolic >= 80) {
            score -= 15;
            factors.push({ name: 'Blood Pressure', value: 5, status: 'danger' });
        }
    }

    // Heart Rate Score (15 points)
    const heartRate = parseFloat(document.getElementById('heart_rate').value);
    if (heartRate) {
        if (heartRate >= 60 && heartRate <= 100) {
            factors.push({ name: 'Heart Rate', value: 15, status: 'good' });
        } else if (heartRate > 100 || heartRate < 60) {
            score -= 8;
            factors.push({ name: 'Heart Rate', value: 7, status: 'warning' });
        }
    }

    // Oxygen Saturation Score (10 points)
    const oxygenSat = parseFloat(document.getElementById('oxygen_saturation').value);
    if (oxygenSat) {
        if (oxygenSat >= 95) {
            factors.push({ name: 'Oxygen Saturation', value: 10, status: 'good' });
        } else if (oxygenSat >= 90 && oxygenSat < 95) {
            score -= 5;
            factors.push({ name: 'Oxygen Saturation', value: 5, status: 'warning' });
        } else {
            score -= 10;
            factors.push({ name: 'Oxygen Saturation', value: 0, status: 'danger' });
        }
    }

    // Lab Results Score (15 points)
    const bloodSugarFasting = parseFloat(document.getElementById('blood_sugar_fasting').value);
    if (bloodSugarFasting) {
        if (bloodSugarFasting >= 70 && bloodSugarFasting <= 100) {
            factors.push({ name: 'Blood Sugar', value: 5, status: 'good' });
        } else {
            score -= 5;
            factors.push({ name: 'Blood Sugar', value: 0, status: 'warning' });
        }
    }

    const cholesterol = parseFloat(document.getElementById('cholesterol_total').value);
    if (cholesterol) {
        if (cholesterol < 200) {
            factors.push({ name: 'Cholesterol', value: 5, status: 'good' });
        } else {
            score -= 5;
            factors.push({ name: 'Cholesterol', value: 0, status: 'warning' });
        }
    }

    // Lifestyle Score (15 points)
    const sleepHours = parseFloat(document.getElementById('average_sleep_hours').value);
    if (sleepHours) {
        if (sleepHours >= 7 && sleepHours <= 9) {
            factors.push({ name: 'Sleep', value: 5, status: 'good' });
        } else {
            score -= 3;
            factors.push({ name: 'Sleep', value: 2, status: 'warning' });
        }
    }

    const dailySteps = parseFloat(document.getElementById('daily_steps').value);
    if (dailySteps) {
        if (dailySteps >= 8000) {
            factors.push({ name: 'Activity', value: 5, status: 'good' });
        } else if (dailySteps >= 5000) {
            factors.push({ name: 'Activity', value: 3, status: 'warning' });
        } else {
            score -= 3;
            factors.push({ name: 'Activity', value: 2, status: 'warning' });
        }
    }

    const workoutFreq = parseFloat(document.getElementById('workout_frequency').value);
    if (workoutFreq) {
        if (workoutFreq >= 3) {
            factors.push({ name: 'Exercise', value: 5, status: 'good' });
        } else if (workoutFreq >= 1) {
            factors.push({ name: 'Exercise', value: 3, status: 'warning' });
        } else {
            score -= 2;
            factors.push({ name: 'Exercise', value: 1, status: 'warning' });
        }
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));
    
    const roundedScore = Math.round(score);
    document.getElementById('healthScore').textContent = roundedScore;
    
    // Update health score status badge
    updateHealthScoreStatus(roundedScore);
    
    // Update health score chart
    updateHealthScoreChart(score);
    
    return score;
}

// Update health score status badge
function updateHealthScoreStatus(score) {
    const statusElement = document.getElementById('scoreStatus');
    const badge = statusElement.querySelector('.status-badge') || document.createElement('span');
    badge.className = 'status-badge';
    
    if (score === 0) {
        badge.textContent = 'Enter data to calculate';
        badge.className = 'status-badge';
    } else if (score >= 80) {
        badge.textContent = 'Excellent Health';
        badge.className = 'status-badge excellent';
    } else if (score >= 65) {
        badge.textContent = 'Good Health';
        badge.className = 'status-badge good';
    } else if (score >= 50) {
        badge.textContent = 'Fair Health - Room for Improvement';
        badge.className = 'status-badge warning';
    } else {
        badge.textContent = 'Needs Attention - Consult Healthcare Provider';
        badge.className = 'status-badge danger';
    }
    
    if (!statusElement.querySelector('.status-badge')) {
        statusElement.innerHTML = '';
        statusElement.appendChild(badge);
    } else {
        statusElement.querySelector('.status-badge').textContent = badge.textContent;
        statusElement.querySelector('.status-badge').className = badge.className;
    }
}

// Navbar Toggle for Mobile
function initNavbar() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    const sections = document.querySelectorAll('.main-section');
    const observerOptions = {
        root: null,
        rootMargin: '-100px 0px -66%',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Smooth scroll for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// Event Listeners for Auto-calculations
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navbar
    initNavbar();
    
    // Health score calculation on any metric change
    const healthFields = [
        'blood_pressure_systolic', 'blood_pressure_diastolic',
        'heart_rate', 'oxygen_saturation', 'blood_sugar_fasting',
        'cholesterol_total', 'average_sleep_hours', 'daily_steps', 'workout_frequency'
    ];
    
    healthFields.forEach(fieldId => {
        document.getElementById(fieldId)?.addEventListener('input', calculateHealthScore);
    });

    // File upload handler
    document.getElementById('report_file')?.addEventListener('change', handleFileUpload);
    
    // Form submission
    document.getElementById('healthForm')?.addEventListener('submit', handleFormSubmit);
    
    // Reset button
    document.getElementById('resetBtn')?.addEventListener('click', resetForm);
    
    // Initialize charts
    initCharts();
    
    // Initialize n8n configuration
    initN8NConfig();
});

// Handle file upload
async function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    // Store file metadata
    document.getElementById('report_file_name').value = file.name;
    
    // For PDF parsing, you would typically send to a backend service
    // For now, we'll just show a placeholder
    if (file.type === 'application/pdf') {
        document.getElementById('parsed_text').value = 
            'PDF file uploaded. Parsing requires backend service integration.';
    } else if (file.type.startsWith('image/')) {
        document.getElementById('parsed_text').value = 
            'Image file uploaded. OCR parsing requires backend service integration.';
    }
}

// Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const statusMessage = document.getElementById('statusMessage');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    
    // Collect form data
    const formData = collectFormData();
    
    try {
        // Validate that at least some health data is provided
        const hasData = Object.keys(formData).some(key => {
            const value = formData[key];
            return value !== null && value !== undefined && value !== '';
        });
        
        if (!hasData) {
            throw new Error('Please fill in at least some health data fields');
        }
        
        // Get n8n webhook URL
        const webhookUrl = getN8NWebhookUrl();
        
        console.log('Sending data to webhook:', webhookUrl);
        console.log('Data:', formData);
        
        // Send to n8n webhook with CORS support
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'cors',
            credentials: 'omit'
        });
        
        console.log('Response status:', response.status);
        
        // Even if response is not ok, try to parse it for error details
        let result;
        try {
            result = await response.json();
        } catch (e) {
            result = { error: 'Could not parse response' };
        }
        
        if (!response.ok) {
            throw new Error(`Submission failed with status ${response.status}: ${result.error || response.statusText}`);
        }
        
        // Display success message
        showStatusMessage('✅ Health data submitted successfully!', 'success');
        console.log('Success response:', result);
        
        // Update AI insights if returned from n8n workflow
        if (result.risk_prediction) {
            document.getElementById('risk_prediction').value = result.risk_prediction;
        }
        if (result.preventive_suggestions) {
            document.getElementById('preventive_suggestions').value = result.preventive_suggestions;
        }
        if (result.trend_summary) {
            document.getElementById('trend_summary').value = result.trend_summary;
        }
        if (result.overall_health_score !== undefined) {
            document.getElementById('healthScore').textContent = Math.round(result.overall_health_score);
            updateHealthScoreChart(result.overall_health_score);
        }
        
        // Update charts with current data
        updateCharts();
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showStatusMessage(`❌ Error: ${error.message}`, 'error');
    } finally {
        // Re-enable submit button
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-icon">✅</span><span>Submit Health Data</span>';
    }
}

// Collect form data
function collectFormData() {
    const form = document.getElementById('healthForm');
    const formData = new FormData(form);
    const data = {};
    
    // List of numeric fields
    const numericFields = [
        'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'oxygen_saturation', 
        'temperature', 'hemoglobin', 'blood_sugar_fasting', 'blood_sugar_pp',
        'cholesterol_total', 'HDL', 'LDL', 'triglycerides', 'vitamin_d',
        'vitamin_b12', 'calcium', 'thyroid_TSH', 'thyroid_T3', 'thyroid_T4',
        'daily_steps', 'average_sleep_hours', 'calories_intake', 'water_intake',
        'workout_frequency'
    ];
    
    // Convert FormData to object
    for (const [key, value] of formData.entries()) {
        // Skip file inputs (they're objects, not strings)
        if (value instanceof File) {
            continue;
        }
        
        // Only process string values that are not empty
        if (typeof value === 'string' && value.trim() !== '') {
            // Convert numeric fields
            if (numericFields.includes(key)) {
                data[key] = parseFloat(value) || null;
            } else {
                data[key] = value;
            }
        }
    }
    
    // Add calculated fields
    const healthScore = calculateHealthScore();
    data.overall_health_score = healthScore;
    data.submission_date = new Date().toISOString();
    
    return data;
}

// Status message handler
function showStatusMessage(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.className = 'status-message';
    }, 5000);
}

// Reset form
function resetForm() {
    if (confirm('Are you sure you want to reset all form data?')) {
        document.getElementById('healthForm').reset();
        document.getElementById('healthScore').textContent = '0';
        document.getElementById('statusMessage').className = 'status-message';
        
        // Reset charts
        initCharts();
    }
}

// Initialize Charts
function initCharts() {
    // Health Score Chart (Gauge-style)
    const healthScoreCtx = document.getElementById('healthScoreChart');
    if (healthScoreCtx && !healthScoreChart) {
        healthScoreChart = new Chart(healthScoreCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [0, 100],
                    backgroundColor: ['#2563eb', '#e2e8f0'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
    
    // Vital Signs Chart
    const vitalCtx = document.getElementById('vitalSignsChart');
    if (vitalCtx && !vitalSignsChart) {
        vitalSignsChart = new Chart(vitalCtx, {
            type: 'bar',
            data: {
                labels: ['Systolic BP', 'Diastolic BP', 'Heart Rate', 'Oxygen Sat', 'Temperature'],
                datasets: [{
                    label: 'Vital Signs',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(37, 99, 235, 0.6)',
                    borderColor: 'rgba(37, 99, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Lab Results Chart
    const labCtx = document.getElementById('labResultsChart');
    if (labCtx && !labResultsChart) {
        labResultsChart = new Chart(labCtx, {
            type: 'line',
            data: {
                labels: ['Hemoglobin', 'Fasting BS', 'PP BS', 'Cholesterol', 'HDL', 'LDL', 'Triglycerides'],
                datasets: [{
                    label: 'Lab Values',
                    data: [0, 0, 0, 0, 0, 0, 0],
                    borderColor: 'rgba(16, 185, 129, 1)',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });
    }
    
    // Lifestyle Chart
    const lifestyleCtx = document.getElementById('lifestyleChart');
    if (lifestyleCtx && !lifestyleChart) {
        lifestyleChart = new Chart(lifestyleCtx, {
            type: 'radar',
            data: {
                labels: ['Steps', 'Sleep', 'Calories', 'Water', 'Workouts'],
                datasets: [{
                    label: 'Lifestyle Metrics',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(245, 158, 11, 0.2)',
                    borderColor: 'rgba(245, 158, 11, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    r: { beginAtZero: true }
                }
            }
        });
    }
    
    updateCharts();
}

// Update Charts with current data
function updateCharts() {
    // Update Health Score Chart
    if (healthScoreChart) {
        const score = parseFloat(document.getElementById('healthScore').textContent) || 0;
        healthScoreChart.data.datasets[0].data = [score, 100 - score];
        healthScoreChart.data.datasets[0].backgroundColor = [
            score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
            '#e2e8f0'
        ];
        healthScoreChart.update();
    }
    
    // Update Vital Signs Chart
    if (vitalSignsChart) {
        vitalSignsChart.data.datasets[0].data = [
            parseFloat(document.getElementById('blood_pressure_systolic').value) || 0,
            parseFloat(document.getElementById('blood_pressure_diastolic').value) || 0,
            parseFloat(document.getElementById('heart_rate').value) || 0,
            parseFloat(document.getElementById('oxygen_saturation').value) || 0,
            parseFloat(document.getElementById('temperature').value) || 0
        ];
        vitalSignsChart.update();
    }
    
    // Update Lab Results Chart
    if (labResultsChart) {
        labResultsChart.data.datasets[0].data = [
            parseFloat(document.getElementById('hemoglobin').value) || 0,
            parseFloat(document.getElementById('blood_sugar_fasting').value) || 0,
            parseFloat(document.getElementById('blood_sugar_pp').value) || 0,
            parseFloat(document.getElementById('cholesterol_total').value) || 0,
            parseFloat(document.getElementById('HDL').value) || 0,
            parseFloat(document.getElementById('LDL').value) || 0,
            parseFloat(document.getElementById('triglycerides').value) || 0
        ];
        labResultsChart.update();
    }
    
    // Update Lifestyle Chart
    if (lifestyleChart) {
        const steps = parseFloat(document.getElementById('daily_steps').value) || 0;
        const sleep = parseFloat(document.getElementById('average_sleep_hours').value) || 0;
        const calories = parseFloat(document.getElementById('calories_intake').value) || 0;
        const water = parseFloat(document.getElementById('water_intake').value) || 0;
        const workouts = parseFloat(document.getElementById('workout_frequency').value) || 0;
        
        // Normalize values for radar chart (0-100 scale)
        lifestyleChart.data.datasets[0].data = [
            Math.min(100, (steps / 10000) * 100),
            Math.min(100, (sleep / 9) * 100),
            Math.min(100, (calories / 2500) * 100),
            Math.min(100, (water / 3) * 100),
            Math.min(100, (workouts / 5) * 100)
        ];
        lifestyleChart.update();
    }
}

// Update health score chart specifically
function updateHealthScoreChart(score) {
    if (healthScoreChart) {
        healthScoreChart.data.datasets[0].data = [score, 100 - score];
        healthScoreChart.data.datasets[0].backgroundColor = [
            score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
            '#e2e8f0'
        ];
        healthScoreChart.update();
    }
}

// n8n Configuration Functions
function initN8NConfig() {
    // n8n configuration is handled automatically
    // Webhook URL can be changed by modifying N8N_WEBHOOK_URL constant
    // or by storing in localStorage via getN8NWebhookUrl()
}

