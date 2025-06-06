export const verificationEmail = (code: number) => {
   return  `<!DOCTYPE html>
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
                            color: #4CAF50;
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
                            background-color: #4CAF50;
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
                        <div class="header">Verify Your Email Address</div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>
                            Thank you for joining us! To complete your registration and secure your account, please enter the following verification code in the application:
                            </p>
                            <div class="code-box">${code}</div>
                            <p>
                            This code is valid for a limited time, so please use it promptly. If you didn’t request this verification, please disregard this email.
                            </p>
                            <p>We’re here to help if you need any assistance.</p>
                            <p>Best regards,<br>The GadgetPeeks Team</p>
                        </div>
                        <div class="footer">
                            This is an automated message. Please do not reply to this email.
                        </div>
                        </div>
                    </body>
                    </html>`
}