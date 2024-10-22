import jwt from 'jsonwebtoken';
import { errorHandeler } from '../utils/error.js';
import User from '../models/user.model.js';

export const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer ", "");
    
        if(!token) return next(errorHandeler(401, "You are not authenticated ."));
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    
        if(!user) return next(errorHandeler(404, "User not found!"));
    
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
}