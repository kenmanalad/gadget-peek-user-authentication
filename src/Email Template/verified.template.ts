export const accountVerifiedEmail = () => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #e0f7fa;
        font-family: 'Helvetica Neue', sans-serif;
        color: #004d40;
      }
      .wrapper {
        max-width: 550px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 30px 25px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
      }
      .header {
        text-align: center;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 25px;
        color: #00796b;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .highlight {
        background-color: #00796b;
        color: #ffffff;
        font-weight: bold;
        padding: 12px;
        border-radius: 6px;
        text-align: center;
        font-size: 18px;
        margin: 20px 0;
      }
      .footer {
        font-size: 12px;
        color: #777;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">Account Verified Successfully</div>
      <div class="content">
        <p>Hello,</p>
        <p>Your email has been successfully verified. You can now fully access your account and all features of our platform.</p>
        <div class="highlight">Your account is now active</div>
        <p>If you did not initiate this verification, please contact our support team immediately.</p>
        <p>Welcome aboard!<br>The GadgetPeeks Team</p>
      </div>
      <div class="footer">This is an automated message. Please do not reply to this email.</div>
    </div>
  </body>
  </html>`;
};
