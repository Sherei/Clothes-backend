const SignupUsers = require("../model/user");
const token = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

require("dotenv").config();
const bcrypt = require("bcrypt");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "ra0511083@gmail.com",
    pass: "qauk brdr ehmr twox",
  },
});


const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};
exports.Signup = async (req, res) => {  

    console.log("Welcome");
    try {
      const existingUser = await SignupUsers.findOne({ email: req.body.email });
  
      if (existingUser) {
        return res.status(400).send("User with this email already exists");
      } else {
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
  
        // const hashedPassword = await bcrypt.hash(req.body.password, 10);
  
        const newUser = new SignupUsers({
          ...req.body,
          // password: hashedPassword,
          password: req.body.password,
          points: 100,
          role: "user",
          level: "1",
          otp: otp,
          otpExpires: otpExpires,
          isVerified: false,
        });
  
        const savedUser = await newUser.save(); // Save the new user
  
        // After user is saved, the ID should be available
        const userId = savedUser._id;
  
        const mailOptions = {
          from: "'SHOP.CO' <ra0511083@gmail.com>",
          to: req.body.email,
          subject: "Verify Your Email",
          text: `Your OTP for email verification is: ${otp}`,
        };
  
        // Send email asynchronously without affecting the response
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log("Error while sending email:", error);
          } else {
            console.log("Email sent successfully");
          }
        });
  
        // Respond with user ID immediately after saving user (email sending happens in the background)
        return res.status(200).json({
          message: "User Created. Please verify your email using the OTP sent.",
          email: req.body.email,
          userId: userId, // Return user ID here
        });
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send("Internal Server Error");
    }
  };
  
  //verify email
  exports.VerifyEmail = async (req, res) => {  

    console.log("first");
    try {
      const { email, otp } = req.body;
      console.log(email, otp, "email");
      const user = await SignupUsers.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.otp === otp && user.otpExpires > Date.now()) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
  
        res.status(200).json({ message: "Email verified successfully" });
      } else {
        res.status(400).send("Invalid or expired OTP");
      }
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };
  
  //forgot password
  exports.ForgotPassword = async (req, res) => {  
    console.log("first");
    const { email } = req.body;
  
    try {
      const user = await SignupUsers.findOne({ email });
      console.log(user);
      if (!user) {
        return res.status(404).send("No user with that email");
      }
  
      const token = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 3600000;
  
      user.resetPasswordToken = token;
      user.resetPasswordExpires = tokenExpiry;
      await user.save();
  
      const mailOptions = {
        to: user.email,
        from: "'SHOP.CO' <ra0511083@gmail.com>",
        subject: "Password Reset",
        text: `Please click the following link to reset your password: \n\n http://localhost:3000/reset-password/${token} \n\n`,
      };
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log("err:", err);
          return res.status(500).send("Error sending email");
        }
        res.status(200).send("Password reset email sent.");
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  };
  
  //get reset token
  exports.ResetPassword = async (req, res) => {  

    try {
      const user = await SignupUsers.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res
          .status(400)
          .send("Password reset token is invalid or has expired.");
      }
  
      res.status(200).send("Token is valid, proceed to reset password.");
    } catch (err) {
      res.status(500).send("Server error");
    }
  };
  
  //reset password api
  exports.ResetPasswordToken = async (req, res) => {  

    const { password } = req.body;
  
    try {
      const user = await SignupUsers.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res
          .status(400)
          .send("Password reset token is invalid or has expired.");
      }
  
      // const salt = await bcrypt.genSalt(10);
      // const hashedPassword = await bcrypt.hash(password, salt);
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
  
      await user.save();
  
      const mailOptions = {
        to: user.email,
        from: "'SHOP.CO' <ra0511083@gmail.com>",
        subject: "Your password has been successfully changed",
        text: "This is a confirmation that your password has been successfully changed.",
      };
  
      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          return res.status(500).send("Error sending confirmation email");
        }
        res.status(200).send("Password has been reset successfully.");
      });
    } catch (err) {
      res.status(500).send("Server error");
    }
  };
  
  //Update user role user to admin
  exports.UpdateStatus = async (req, res) => {  

    try {
      const userId = req.body.id;
      const newRole = req.body.role;
      const updatedUser = await SignupUsers.findByIdAndUpdate(
        userId,
        { role: newRole },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
      res.json(updatedUser);
    } catch (e) {
      res.status(500).send("Error updating user status");
    }
  };
  
  // End
  exports.Login = async (req, res) => {  

    try {
      const user = await SignupUsers.findOne({
        email: req.body.email,
        password: req.body.password,
      });
      if (!user) {
        return res.status(404).send("Invalid Credentials");
      }
      // const isPasswordValid = await bcrypt.compare(
      //   req.body.password,
      //   user.password
      // );
  
      if (user) {
        token.sign(
          { tokenId: user._id },
          "My user",
          { expiresIn: "1y" },
          async (err, myToken) => {
            res.json({ user, myToken });
          }
        );
      } else {
        res.status(404).send("Invalid Credentials");
      }
    } catch (e) {
      res.status(500).send("Internal Server Error");
    }
  };
  exports.SessionCheck = async (req, res) => {  

    try {
      token.verify(req.body.token, "My user", async function (err, dataObj) {
        if (dataObj) {
          const user = await SignupUsers.findById(dataObj.tokenId);
          res.json(user);
        }
      });
    } catch (e) {}
  };
  exports.GetUsers = async (req, res) => {  

    try {
      const newUser = await SignupUsers.find().sort({ _id: -1 });
      res.json(newUser);
    } catch (e) {}
  };
  exports.DeleteUser = async (req, res) => {  

    try {
      await SignupUsers.findByIdAndDelete(req.query.id);
  
      res.end("Delete ho gya");
    } catch (e) {
      res.send(e);
    }
  };
  