export function generateAccessAndRefreshTokens(user) {
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()

  return {accessToken, refreshToken}
}

export function getEmailHtml(name, otp) {
  return `
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: Arial, Helvetica, sans-serif;
                    background-color: #f4f6fb;
                    color: #333333;
                }
                .email-wrapper {
                    width: 100%;
                    padding: 40px 15px;
                    box-sizing: border-box;
                }
                .email-container {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.06);
                }
                .email-header {
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    padding: 35px 20px;
                    text-align: center;
                    color: #ffffff;
                }
                .email-header h1 {
                    margin: 0;
                    font-size: 26px;
                    font-weight: 700;
                }
                .email-header p {
                    margin: 10px 0 0;
                    font-size: 14px;
                    opacity: 0.9;
                }
                .email-body {
                    padding: 35px 30px;
                    text-align: center;
                }
                .email-body h2 {
                    font-size: 22px;
                    color: #222222;
                    margin: 0 0 15px;
                }
                .email-body p {
                    font-size: 15px;
                    line-height: 1.7;
                    color: #666666;
                    margin: 0 0 20px;
                }
                .otp-container {
                    background-color: #f5f3ff;
                    border: 1px dashed #a78bfa;
                    border-radius: 12px;
                    padding: 22px 15px;
                    margin: 25px 0;
                }
                .otp-code {
                    font-size: 36px;
                    font-weight: 700;
                    letter-spacing: 10px;
                    color: #4f46e5;
                    margin: 0;
                    padding-left: 10px;
                }
                .copy-button {
                    display: inline-block;
                    margin-top: 18px;
                    padding: 10px 22px;
                    background-color: #4f46e5;
                    color: #ffffff !important;
                    text-decoration: none;
                    border-radius: 7px;
                    font-size: 13px;
                    font-weight: 600;
                }
                .expiry-notice {
                    font-size: 13px !important;
                    color: #e67e22 !important;
                    margin-top: 15px !important;
                }
                .security-notice {
                    background-color: #fff7ed;
                    border-left: 4px solid #f59e0b;
                    padding: 15px;
                    border-radius: 5px;
                    text-align: left;
                    margin-top: 25px;
                }
                .security-notice p {
                    font-size: 13px;
                    color: #92400e;
                    margin: 0;
                }
                .email-footer {
                    background-color: #fafafa;
                    padding: 22px 20px;
                    text-align: center;
                    border-top: 1px solid #eeeeee;
                }
                .email-footer p {
                    font-size: 12px;
                    line-height: 1.6;
                    color: #999999;
                    margin: 5px 0;
                }
                @media only screen and (max-width: 480px) {
                    .email-body {
                        padding: 25px 20px;
                    }
                    .otp-code {
                        font-size: 28px;
                        letter-spacing: 7px;
                    }
                    .email-header h1 {
                        font-size: 23px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="email-wrapper">
                <div class="email-container">
                    <!-- Header -->
                    <div class="email-header">
                        <h1>Verify Your Email</h1>
                        <p>One last step to get started!</p>
                    </div>
                    <!-- Main Content -->
                    <div class="email-body">
                        <h2>Hello, ${name}!</h2>
                        <p>
                            Thank you for signing up. To complete your registration,
                            please use the verification code below.
                        </p>
                        <!-- OTP Section -->
                        <div class="otp-container">
                            <p style="margin-bottom: 12px; font-size: 13px; color: #777777;">
                                YOUR VERIFICATION CODE
                            </p>
                            <div class="otp-code">
                                ${otp}
                            </div>
                            <!-- Email-safe alternative: select and copy the code manually -->
                            <p style="font-size: 12px; margin: 15px 0 0; color: #777777;">
                                Copy this code and paste it into the verification field.
                            </p>
                        </div>
                        <p class="expiry-notice">
                            ⏰ This code will expire in 5 minutes.
                        </p>
                        <!-- Security Notice -->
                        <div class="security-notice">
                            <p>
                                <strong>Security Notice:</strong>
                                Never share this verification code with anyone.
                                Our team will never ask you for your OTP.
                            </p>
                        </div>
                        <p style="margin-top: 25px;">
                            If you did not create an account, you can safely
                            ignore this email.
                        </p>
                    </div>
                    <!-- Footer -->
                    <div class="email-footer">
                        <p>
                            © 2026 polyStack. All rights reserved.
                        </p>
                        <p>
                            This is an automated email. Please do not reply.
                        </p>
                    </div>
                </div>
            </div>
        </body>
    </html>
  `
}

export function getOtp() {
  return Math.floor((Math.random() * 99999) + 100000).toString()
}