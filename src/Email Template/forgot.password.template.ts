export const forgotPasswordEmail = (code: number) => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        color: #333333;
        background-color: #f7f7f7;
        padding: 20px;
      }
      .email-container {
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        max-width: 600px;
        margin: auto;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
      }
      .header {
        color: #f57c00;
        text-align: center;
        font-size: 24px;
        margin-bottom: 20px;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
      }
      .code-box {
        font-size: 24px;
        font-weight: bold;
        color: #ffffff;
        background-color: #f57c00;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        margin: 20px 0;
      }
      .footer {
        text-align: center;
        color: #888888;
        font-size: 12px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">Reset Your Password</div>
      <div class="content">
        <p>Hello,</p>
        <p>
          We received a request to reset your password. To proceed, please use the verification code below in the application:
        </p>
        <div class="code-box">${code}</div>
        <p>
          This code is valid for a limited time. If you did not request a password reset, you can safely ignore this email and your password will remain unchanged.
        </p>
        <p>Need help? Just reply to this email and we'll assist you.</p>
        <p>Best regards,<br>The GadgetPeeks Team</p>
      </div>
      <div class="footer">
        This is an automated message. Please do not reply to this email.
      </div>
    </div>
  </body>
  </html>`;
};