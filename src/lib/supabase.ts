
import { createClient } from '@supabase/supabase-js';

// Check if environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.');
}

// Create the Supabase client with error handling and redirect config
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || '',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      redirectTo: `${siteUrl}/auth/callback`,
    },
  }
);

// Function to get email template content
export const getEmailTemplate = () => {
  return {
    // Email template for Supabase email confirmation
    emailTemplate: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Confirm Your Outsmash Account</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #121212;
              color: #ffffff;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              padding: 20px 0;
              border-bottom: 1px solid #333;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              color: #9b87f5;
              background: linear-gradient(to right, #9b87f5, #8B5CF6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .content {
              padding: 30px 20px;
              background-color: #1e1e1e;
              border-radius: 8px;
              margin: 20px 0;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background: linear-gradient(to right, #9b87f5, #8B5CF6);
              color: white !important;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 20px 0;
              text-align: center;
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #888;
              padding: 20px 0;
            }
            h1 {
              color: #ffffff;
            }
            p {
              line-height: 1.6;
              color: #e0e0e0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Outsmash</div>
            </div>
            <div class="content">
              <h1>Confirm Your Account</h1>
              <p>Thanks for signing up with Outsmash! Please confirm your email address to get access to all features.</p>
              <a href="{{ .ConfirmationURL }}" class="button">Confirm My Account</a>
              <p>If you didn't create an account with Outsmash, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Outsmash. All rights reserved.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };
};
