const userModel = require("../Models/userModel");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const welcomeEmailTemplate = require("../emailTemplate/templates/welcomeEmailTemplate");
const Email = require("../Models/emailModel");
const UserOtp = require("../Models/userOtps");

const createToken = (_id) => {
  const jwtkey = process.env.JWT_SECRET_KEY;
  return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: "shoumar.mohamad1@gmail.com",
    pass: "dafrotudeqojtwbt",
  },
  from: "shahzaibyounus115@gmail.com",
});

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email input
    if (!email) {
      return res.status(400).json("Email is required.");
    }

    // Generate 5-digit numeric OTP
    const otp = otpGenerator.generate(5, {
      upperCase: true,
      specialChars: false,
      alphabets: true,
      digits: false,
    });

    // Save OTP with timestamp
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
    let user = await UserOtp.findOneAndUpdate(
      { email },
      { email, otp, otpExpiresAt },
      { new: true, upsert: true }
    );

    // Send OTP via email
    const mailOptions = {
      from: "shoumar.mohamad1@gmail.com",
      to: user.email,
      subject: "Your OTP for Registration",
      text: `
Dear User,

Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):

OTP: ${otp}

This OTP is valid for 1 hour.

If you did not request this registration, please ignore this email.

Best regards,
The Team
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json("Error sending OTP via email.");
      } else {
        console.log("Email sent: " + info.response);
        // Respond to the client
        res
          .status(200)
          .json({ message: "OTP sent via email. Please check your email." });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, phonenumber, password } = req.body;

    // Check if the email already exists
    let user = await userModel.findOne({ email });
    if (user)
      return res.status(400).json("User with the given Email already exists.");

    // Validate input fields
    if (!name || !email || !phonenumber || !password) {
      return res.status(400).json("All fields are required.");
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json("Password must be a strong Password.");
    }

    // Generate OTP
    const otp = otpGenerator.generate(6, {
      upperCase: false,
      specialChars: false,
    });

    // Save OTP with timestamp
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now
    user = new userModel({
      name,
      email,
      phonenumber,
      password,
      otp,
      otpExpiresAt,
    });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save the user with OTP
    await user.save();

    // Send OTP via email
    const mailOptions = {
      from: "dhammal940@gmail.com",
      to: user.email,
      subject: "Your OTP for Registration",
      text: `
Dear ${name},

Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):

OTP: ${otp}

This OTP is valid for 1 hour.

If you did not request this registration, please ignore this email.

Best regards,
The Team
`,
      html: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
        }
        .container {
            margin: 20px;
        }
        .header {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .content {
            margin-bottom: 20px;
        }
        .footer {
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">Your OTP for Registration</div>
        <div class="content">
            <p>Dear ${name},</p>
            <p>Thank you for registering with us. To complete your registration, please use the following One-Time Password (OTP):</p>
            <p><strong>OTP: ${otp}</strong></p>
            <p>This OTP is valid for 1 hour.</p>
            <p>If you did not request this registration, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>The Team</p>
        </div>
    </div>
</body>
</html>
`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json("Error sending OTP via email.");
      } else {
        console.log("Email sent: " + info.response);
        // Respond to the client
        res
          .status(200)
          .json({ message: "OTP sent via email. Please check your email." });
      }
    });

    // Respond with user data including OTP
    res
      .status(200)
      .json({
        status: true,
        data: { _id: user._id, name, email, phonenumber, otp },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await userModel.findOne({ email });

    if (!user) return res.status(400).json("User not found...");

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json("Invalid Email or password...");

    res.status(200).json({
      status: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phonenumber: user.phonenumber,
      },
      // Add other user data fields as needed
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  console.log("otp", otp);

  try {
    const userOtp = await UserOtp.findOne({ email });
    console.log("ududududud", userOtp);

    if (!userOtp) {
      return res
        .status(400)
        .json({ status: false, message: "User not found." });
    }

    // Check if OTP matches and is not expired
    if (userOtp.otp === otp && userOtp.otpExpiresAt > new Date()) {
      console.log("dddd", userOtp.otp);
      // Remove OTP and expiration from user document after successful verification
      userOtp.otp = undefined;
      userOtp.otpExpiresAt = undefined;

      // Remove fields from the document
      await UserOtp.updateOne(
        { email },
        { $unset: { otp: "", otpExpiresAt: "" } }
      );

      // Return success response
      return res
        .status(200)
        .json({ status: true, message: "OTP verified successfully." });
    } else {
      return res
        .status(400)
        .json({ status: false, message: "Invalid or expired OTP." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: "Server error." });
  }
};

const findUser = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await userModel.findById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
  verifyOTP,
  sendEmail,
};
