import nodemailer from 'nodemailer'

// Email configuration
const EMAIL_CONFIG = {
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password'
  }
}

// Create transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG)

/**
 * Generate a 6-digit OTP
 * @returns {string} - 6-digit OTP
 */
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Send OTP email
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} userName - User's name
 * @returns {Promise<boolean>} - Success status
 */
export const sendOTPEmail = async (email, otp, userName = 'User') => {
  try {
    const mailOptions = {
      from: `"PESITM CSE Department" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'Password Reset OTP - PESITM CSE Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .otp-box {
              background: white;
              border: 2px dashed #003366;
              padding: 20px;
              text-align: center;
              margin: 20px 0;
              border-radius: 5px;
            }
            .otp-code {
              font-size: 32px;
              font-weight: bold;
              color: #003366;
              letter-spacing: 5px;
              font-family: 'Courier New', monospace;
            }
            .warning {
              background: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 15px;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Password Reset Request</h1>
              <p>PESITM Computer Science & Engineering</p>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>We received a request to reset your password. Please use the OTP below to proceed with password reset:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #666;">Valid for 10 minutes</p>
              </div>

              <div class="warning">
                <strong>⚠️ Security Note:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                  <li>This OTP is valid for 10 minutes only</li>
                  <li>Do not share this OTP with anyone</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password will not change unless you complete the reset process</li>
                </ul>
              </div>

              <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
              
              <p>Best regards,<br>
              PESITM CSE Department IT Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PESITM Computer Science & Engineering Department</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('OTP email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending OTP email:', error)
    return false
  }
}

/**
 * Send password reset confirmation email
 * @param {string} email - Recipient email
 * @param {string} userName - User's name
 * @returns {Promise<boolean>} - Success status
 */
export const sendPasswordResetConfirmation = async (email, userName = 'User') => {
  try {
    const mailOptions = {
      from: `"PESITM CSE Department" <${EMAIL_CONFIG.auth.user}>`,
      to: email,
      subject: 'Password Successfully Reset - PESITM CSE Portal',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success-icon {
              font-size: 48px;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Password Reset Successful</h1>
              <p>PESITM Computer Science & Engineering</p>
            </div>
            <div class="content">
              <div class="success-icon">✅</div>
              <p>Dear ${userName},</p>
              <p>Your password has been successfully reset. You can now log in to the PESITM CSE Portal using your new password.</p>
              
              <p><strong>What to do next:</strong></p>
              <ol>
                <li>Visit the login page</li>
                <li>Enter your credentials with the new password</li>
                <li>Access your dashboard</li>
              </ol>

              <p>If you did not make this change or if you believe an unauthorized person has accessed your account, please contact the IT department immediately.</p>
              
              <p>Best regards,<br>
              PESITM CSE Department IT Team</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PESITM Computer Science & Engineering Department</p>
              <p>This is an automated email. Please do not reply.</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Password reset confirmation email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending confirmation email:', error)
    return false
  }
}

/**
 * Test email configuration
 * @returns {Promise<boolean>} - Success status
 */
export const testEmailConfig = async () => {
  try {
    await transporter.verify()
    console.log('Email server is ready to send messages')
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}

export default {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetConfirmation,
  testEmailConfig
}
