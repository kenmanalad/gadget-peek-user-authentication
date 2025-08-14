export const changePasswordEmail = () => {
  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f1f8e9;
        font-family: 'Helvetica Neue', sans-serif;
        color: #33691e;
      }
      .wrapper {
        max-width: 550px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 12px;
        padding: 30px 25px;
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
      }
      .header {
        text-align: center;
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 25px;
        color: #558b2f;
      }
      .content {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 20px;
      }
      .highlight {
        background-color: #558b2f;
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
        color: #888;
        text-align: center;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="header">Password Changed Successfully</div>
      <div class="content">
        <p>Hello,</p>
        <p>Your password has been successfully updated. You can now log in using your new credentials.</p>
        <div class="highlight">Your password has been changed</div>
        <p>If you did not perform this action, please reset your password immediately or contact our support team.</p>
        <p>Stay safe,<br>The GadgetPeeks Team</p>
      </div>
      <div class="footer">This is an automated message. Please do not reply to this email.</div>
    </div>
  </body>
  </html>`;
};
