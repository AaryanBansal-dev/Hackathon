HEALTHCARE
Problem Statement 1: The Future of Preventive Care
Across the world, healthcare systems focus on treatment more than prevention. Millions suffer from diseases that could have been detected or prevented early with the right information, habits, or accessibility.
Challenge: How can technology help people monitor, understand, and improve their health before problems occur?
You might explore solutions in digital health tracking, AI triage, community reporting, gamified wellness, or something entirely new.
Focus on accessibility, early action, and trust, not on medical complexity.
Solution
1. Voice-Based Food Tracking
Simply speak to the app—say things like “I ate half a bowl of dal-rice and one roti today.” The app understands what you say, identifies the food items, and matches them with its database that contains nutritional information such as calories, protein, fats, and vitamins. It then calculates your daily intake and compares it with your ideal nutritional goals based on your BMI. You can easily track whether you’ve met, fallen short of, or exceeded your daily targets.
Based on your daily intake and goals, the app can also suggest what to eat next — for example, if you’re low on protein, it might recommend lentils, eggs, or paneer for dinner. It can even create custom meal plans for your BMI, dietary preferences (veg/non-veg), and health conditions (like diabetes or PCOS).
2. Personalized Exercise Suggestions
 Using your BMI and medical details, the app recommends short and easy home workouts designed to fit your fitness level. These exercises help you stay active and maintain a healthy balance.
3. Medical Record Integration & Health Insights
 You can upload your previous medical reports and records to the app. It stores and studies them to give you personalized answers to your diet and health questions. Over time, the app uses this data to make informed predictions about your health trends and suggest preventive measures.
In short, it’s like having a personal doctor and fitness guide in your pocket—one that listens, learns, and helps you live healthier every day.


Features -

Voice + Chat AI Health Assistant
Besides voice input for meals, you could add an AI chat assistant that answers health questions conversationally — like “How much protein do I need today?” or “Why am I feeling tired after lunch?” It can give answers based on the user’s data and medical history.
Progress Dashboard
A clean, visual dashboard that shows your daily, weekly, and monthly nutrition trends — calories consumed, weight changes, water intake, and workout consistency — so users can actually see their progress.


Tech Stack
1. Frontend (App Interface)
Purpose: Collect user input (voice/text), show nutrition and progress, handle chat, and file uploads.
Tech:
HTML, CSS, JavaScript
Web Speech API – converts speech to text
Fetch API – sends requests to n8n webhooks and displays returned data.
Chart.js – for graphs and daily/weekly stats.
2. n8n (Backend Logic & Workflow Orchestrator)
Purpose: Acts as the middle layer between your app, Gemini, and the database.
Hosted on: Render.
Nodes used:
Webhook Node – receives input from frontend
Function Node – for BMI and nutrition calculations
Database Node – to store user reports and prompts (supabase)
PDF Extract / function Node - extracts text from the text-based PDF
HTTP Request Node – to send prompts and data to Gemini API
Database Node –  Stores the response (supabase)
HTTP Response Node – sends final processed result back to frontend
guide me to create a N8N workflow where the user gives an input through chat about the food that they are eating. For eg: I am eating half a bowl of dal-rice and one roti right now.
This will be a diet tracker app, which gives this data given by the user to an AI which calculates how much nutritional information the user has consumed in this meal.
Take weight and height from user. Calculate their BMI, decide how much their per day nutrient intake should be.

Now, take the input from the user about their current meal.
Send this to Supabase and this data is tracked in dashboard of website using supabase data.
