// Aaple Sarkar Maha e-Seva Digital Portal - Centralized Configuration
// Paste all keys, tokens, and settings here securely.
// Since the site is protected by client-side authentication, these are safe to bundle.

window.CONFIG = {
  // 1. Google Apps Script Webhook URL
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbyE3KOB5M5hko6ymyDkS4Cc7YblVoKL5OyGOmYvvxbk04lNZwaINVcPQtG7QQndDU0R/exec",

  // 2. Google Maps & Review Settings
  GOOGLE_MAPS_KEY: "AIzaSyCvNkBeFsO7iqztj7l2hTWPoFs2AgD7FOI",
  PLACE_ID: "ChIJJYGYXNi1wzsRvm4uXm4aYZQ",

  // 3. WhatsApp Cloud API Integration
  WHATSAPP_PHONE_NUMBER_ID: "", // Optional: Your WhatsApp Phone Number ID
  WHATSAPP_BUSINESS_ACCOUNT_ID: "", // Optional: Your WhatsApp Business Account ID
  WHATSAPP_TOKEN: "", // Optional: WhatsApp Access Token if configured on frontend
  WEBHOOK_VERIFY_TOKEN: "mseva_chatbot_secure_token",
  
  // 3b. Customer Support Contact Numbers
  WHATSAPP_NUMBER: "919096768351", // Your WhatsApp Business number (with country code, e.g., 919096768351)
  CONTACT_PHONE: "+919096768351",   // Your public phone call number (e.g., +919096768351)

  // 4. Admin Write Token for Google Apps Script authorization
  ADMIN_TOKEN: "mseva_Q7xL92pA4vN8kR3sT6yB1cD5eF0hWz",

  // 5. Supabase Admin Authentication Configuration
  SUPABASE_URL: "https://xszkwltrgfhtpifnhohg.supabase.co",
  SUPABASE_ANON_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzemt3bHRyZ2ZodHBpZm5ob2hnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzQxMDMsImV4cCI6MjA5NDk1MDEwM30.9bgZrj8os4cxWM-pVBlTBABEye7EEm6gAEx7p1tbvz8",
  ALLOWED_ADMIN_EMAILS: ["omkale422@gmail.com"]
};
