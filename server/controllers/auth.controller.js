import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandeler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import { generateAccessAndRefreshTokens } from "../utils/generateTokens.js";

export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully...." });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandeler(404, "User not found"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandeler(401, "Wrong credentials"));
    const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(validUser._id);
    const options = {
      httpOnly: true,
      secure: true,
    }
    const user = User.findById(validUser._id).select("-password -refreshToken");
    res
      .cookie("access_token", accessToken, options)
      .cookie("refresh_token", refreshToken, options)
      .status(200)
      .json({user: user, accessToken, refreshToken});
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = validUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = newUser._doc;
      const expiryDate = new Date(Date.now() + 3600000);
      res
        .cookie("access_token", token, {
          httpOnly: true,
          expires: expiryDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req,res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      }
    },
    {
      new: true,
    }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
          .status(200)
          .clearCookie("access_token", options)
          .clearCookie("refresh_token", options)
          .json({message: "User logged out successfully....."});
};

export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if(!incomingRefreshToken) {
    next(errorHandeler(401, "User is unauthorised......"));
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    )
  
    const user = User.findById(decodedToken?._id);
  
    if(!user) {
      next(errorHandeler(404, "User not found....."));
    }
  
    if(incomingRefreshToken !== user?.refreshToken) {
      next(errorHandeler(401, "Session has been expired....."));
    }
  
    const options = {
      httpOnly: true,
      secure: true
    }
    const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id);
  
    return res
    .status(200)
    .cookie("access_token", accessToken, options)
    .cookie("refresh_token", newRefreshToken, options)
    .json({accessToken, refreshToken: newRefreshToken, message: "Access Token refreshed!"});
    
  } catch (error) {
    next(error);
  }
};

