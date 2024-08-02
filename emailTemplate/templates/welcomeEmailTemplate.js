const welcomeEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
    .email-header {
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .email-body {
      padding: 20px;
      background-color: white;
      border-radius: 0 0 5px 5px;
    }
    .email-footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #777;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Welcome to Our Service</h1>
    </div>
    <div class="email-body">
      <p>Hello ${name},</p>
      <p>We are excited to have you on board. Here is some important information about our services...</p>
      <p>Thank you,<br>The Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2024 Our Company. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

module.exports = welcomeEmailTemplate;
