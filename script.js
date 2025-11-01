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
            
            // Add subtle animation to recording button
            const stopBtn = document.getElementById('stopRecording');
            stopBtn.style.animation = 'pulse 1s infinite';
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
            
            // Remove animation from recording button
            const stopBtn = document.getElementById('stopRecording');
            stopBtn.style.animation = 'none';
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
    const voiceModal = document.getElementById('voiceModal');
    voiceModal.classList.add('active');
    
    // Apply smooth animation
    voiceModal.style.animation = 'fadeIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
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
    
    // Safely update health score display if element exists
    const healthScoreElement = document.getElementById('healthScore');
    if (healthScoreElement) {
        healthScoreElement.textContent = roundedScore;
    }
    
    // Update health score status badge
    updateHealthScoreStatus(roundedScore);
    
    // Update health score chart
    updateHealthScoreChart(score);
    
    return score;
}

// Update health score status badge
function updateHealthScoreStatus(score) {
    const statusElement = document.getElementById('scoreStatus');
    
    // If element doesn't exist, skip this update
    if (!statusElement) {
        return;
    }
    
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
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', (e) => {
                // Add smooth animation when field is focused
                e.target.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
                calculateHealthScore();
            });
        }
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
    
    // Disable submit button with smooth transition
    submitBtn.disabled = true;
    submitBtn.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    submitBtn.style.animation = 'pulse 0.6s infinite';
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    
    console.log('=== FORM SUBMISSION STARTED ===');
    
    try {
        // Validate that ALL health data fields are filled
        const form = document.getElementById('healthForm');
        const missingFields = [];
        
        // List of required field names
        const requiredFields = [
            'blood_pressure_systolic', 'blood_pressure_diastolic', 'heart_rate', 'oxygen_saturation', 'temperature',
            'hemoglobin', 'blood_sugar_fasting', 'blood_sugar_pp', 'cholesterol_total', 'HDL', 'LDL', 'triglycerides',
            'vitamin_d', 'vitamin_b12', 'calcium', 'thyroid_TSH', 'thyroid_T3', 'thyroid_T4',
            'daily_steps', 'average_sleep_hours', 'calories_intake', 'water_intake', 'workout_frequency',
            'known_conditions', 'medications', 'allergies', 'family_history',
            'report_file_name', 'report_date', 'report_type'
        ];
        
        // Check each required field
        requiredFields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                const value = field.value;
                if (value === null || value === undefined || value.toString().trim() === '') {
                    missingFields.push(fieldName);
                }
            }
        });
        
        console.log('Form validation - missing fields:', missingFields);
        
        if (missingFields.length > 0) {
            const fieldLabels = missingFields.map(field => {
                const fieldElement = document.getElementById(field);
                const label = fieldElement ? fieldElement.previousElementSibling?.textContent || field : field;
                return label.replace(/\*$/, '').trim(); // Remove asterisk if present
            }).join(', ');
            throw new Error(`❌ Please fill in all required fields. Missing: ${fieldLabels}`);
        }
        
        // Collect form data after validation passes
        const formData = collectFormData();
        console.log('Form data collected:', formData);
        
        // Get n8n webhook URL
        let webhookUrl = getN8NWebhookUrl();
        
        // Ensure URL doesn't have trailing slash (n8n doesn't like it)
        webhookUrl = webhookUrl.replace(/\/$/, '');
        
        console.log('=== WEBHOOK REQUEST ===');
        console.log('Webhook URL:', webhookUrl);
        console.log('Method: POST');
        console.log('Headers: { Content-Type: application/json }');
        console.log('Body:', JSON.stringify(formData, null, 2));
        
        // Send to n8n webhook
        console.log('📤 SENDING REQUEST TO WEBHOOK...');
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('📥 RECEIVED RESPONSE');
        console.log('Status:', response.status, response.statusText);
        console.log('Headers:', {
            'content-type': response.headers.get('content-type'),
            'content-length': response.headers.get('content-length')
        });
        
        // Get response text first to see what we're dealing with
        const responseText = await response.text();
        console.log('Response text (raw):', responseText);
        
        // Try to parse as JSON
        let result = {};
        try {
            result = JSON.parse(responseText);
            console.log('Response JSON:', result);
        } catch (e) {
            console.warn('Could not parse response as JSON:', e.message);
            result = { message: responseText };
        }
        
        // Check if request was successful
        if (response.status >= 200 && response.status < 300) {
            showStatusMessage('✅ Health data submitted successfully!', 'success');
            console.log('✅ SUCCESS! Webhook received the request!');
            console.log('=== FORM SUBMISSION COMPLETE ===');
            
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
        } else {
            throw new Error(`HTTP ${response.status}: ${result.message || response.statusText}`);
        }
        
    } catch (error) {
        console.error('❌ Error submitting form:', error);
        console.error('Stack trace:', error.stack);
        showStatusMessage(`❌ Error: ${error.message}`, 'error');
    } finally {
        // Re-enable submit button with smooth animation
        submitBtn.disabled = false;
        submitBtn.style.animation = 'none';
        submitBtn.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
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
    
    // Add smooth animation
    statusMessage.style.animation = 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
    
    // Auto-hide after 5 seconds with smooth fade out
    setTimeout(() => {
        statusMessage.style.transition = 'opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        statusMessage.style.opacity = '0';
        setTimeout(() => {
            statusMessage.className = 'status-message';
            statusMessage.style.opacity = '1';
        }, 400);
    }, 5000);
}

// Reset form
function resetForm() {
    if (confirm('Are you sure you want to reset all form data?')) {
        const form = document.getElementById('healthForm');
        
        // Add fade out animation
        form.style.transition = 'opacity 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        form.style.opacity = '0.5';
        
        setTimeout(() => {
            form.reset();
            document.getElementById('healthScore').textContent = '0';
            document.getElementById('statusMessage').className = 'status-message';
            
            // Reset charts
            initCharts();
            
            // Fade back in
            form.style.opacity = '1';
        }, 300);
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
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                },
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
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
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
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
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
                animation: {
                    duration: 750,
                    easing: 'easeInOutQuart'
                },
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
        const healthScoreElement = document.getElementById('healthScore');
        const score = healthScoreElement ? parseFloat(healthScoreElement.textContent) || 0 : 0;
        healthScoreChart.data.datasets[0].data = [score, 100 - score];
        healthScoreChart.data.datasets[0].backgroundColor = [
            score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444',
            '#e2e8f0'
        ];
        healthScoreChart.update('active');
    }
    
    // Update Vital Signs Chart with smooth animation
    if (vitalSignsChart) {
        vitalSignsChart.data.datasets[0].data = [
            parseFloat(document.getElementById('blood_pressure_systolic').value) || 0,
            parseFloat(document.getElementById('blood_pressure_diastolic').value) || 0,
            parseFloat(document.getElementById('heart_rate').value) || 0,
            parseFloat(document.getElementById('oxygen_saturation').value) || 0,
            parseFloat(document.getElementById('temperature').value) || 0
        ];
        vitalSignsChart.update('active');
    }
    
    // Update Lab Results Chart with smooth animation
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
        labResultsChart.update('active');
    }
    
    // Update Lifestyle Chart with smooth animation
    if (lifestyleChart) {
        const steps = parseFloat(document.getElementById('daily_steps').value) || 0;
        const sleep = parseFloat(document.getElementById('average_sleep_hours').value) || 0;
        const calories = parseFloat(document.getElementById('calories_intake').value) || 0;
        const water = parseFloat(document.getElementById('water_intake').value) || 0;
        const workouts = parseFloat(document.getElementById('workout_frequency').value) || 0;
        
        lifestyleChart.data.datasets[0].data = [
            Math.min(100, (steps / 10000) * 100),
            Math.min(100, (sleep / 9) * 100),
            Math.min(100, (calories / 2500) * 100),
            Math.min(100, (water / 3) * 100),
            Math.min(100, (workouts / 5) * 100)
        ];
        lifestyleChart.update('active');
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
        healthScoreChart.update('active');
    }
}

// n8n Configuration Functions
function initN8NConfig() {
    // n8n configuration is handled automatically
    // Webhook URL can be changed by modifying N8N_WEBHOOK_URL constant
    // or by storing in localStorage via getN8NWebhookUrl()
}

