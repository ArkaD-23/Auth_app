import User from "../models/user.model";

export const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      const refreshToken = user.generateAccessToken();
      const accessToken = user.generateRefreshToken();
      
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return {refreshToken, accessToken};
  
    } catch (error) {
      next(error);
    }
  };