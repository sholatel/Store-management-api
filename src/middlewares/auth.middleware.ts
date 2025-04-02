import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../modules/user/schemas/user.schema';
import jsonResponse from '../utils/jsonResponse';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // 1. Get token from header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json(jsonResponse("You are not logged in! Please log in to get access."));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4. Grant access
    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json(jsonResponse('Invalid token'));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(jsonResponse('You do not have permission to perform this action'));
    }
    next();
  };
};