const userModel = require("../Modals/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    const errorMsg = "Authentication failed Email or Password is wrong";

    if (!existingUser) {
      return res.status(403).json({
        message: { errorMsg },
        success: false,
      });
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isValidPassword) {
      return res.status(403).json({
        message: { errorMsg },
        success: false,
      });
    }
    const jwtToken = jwt.sign(
      { email: existingUser.email, _id: existingUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.status(200).json({
      message: `Login Successfully`,
      success: true,
      jwtToken,
      email,
      name: existingUser.name,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Internal Server Error${error}`,
    });
  }
};
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = new userModel({ name, email, password });
    newUser.password = await bcrypt.hash(password, 10);
    const savedUser = await newUser.save(); // save User in the database

    res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Internal Server Error${error}`,
      success: false,
    });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    //check if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        message: "User does not exists!",
      });
    }
    //genrate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and save to the user
    existingUser.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    existingUser.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token valid for 10 minutes
    await existingUser.save({ validateBeforeSave: false });

    //send email with reset token
    const resetLink = `http://localhost:5173/auth/resetPassword/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "narendrayogi914@gmail.com",
        pass: "uydzkgjgtxyvcnqx",
      },
    });
    const mailOptions = {
      to: existingUser.email,
      subject: "Password Reset",
      text: `Please click on the link to reset your password: ${resetLink}`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.params;

  // Hash the token received from the URL
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user by the hashed token and check expiration
  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Reset the password
  user.password = await bcrypt.hash(req.body.password, 10);
  user.resetPasswordToken = undefined; // Clear the reset token
  user.resetPasswordExpire = undefined; // Clear the expiration

  await user.save();

  res.status(200).json({ message: "Password has been updated successfully." });
};
module.exports = { signup, login, forgetPassword, resetPassword };
