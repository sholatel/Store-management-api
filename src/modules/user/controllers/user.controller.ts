import {  Response } from 'express';
import User from '../schemas/user.schema';
import signToken from '../../../utils/signToken';
import { IRequest } from '../../../Interfaces/custom.interface';
import jsonResponse from '../../../utils/jsonResponse';
import logger from '../../../utils/logger';
import crypto from "crypto";
import sendVerificationEmail from '../../../utils/sendEmailVerificationToken';


export const signup = async (req: IRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const verificationToken  = crypto.randomBytes(32).toString('hex')

    const existingUser = await User.findOne({email});

    if (existingUser) {
      return res.status(409).json(jsonResponse("This email is already taken. Please use another email to register"))
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: 'user',
      emailVerificationToken:verificationToken
    });

    sendVerificationEmail(email,verificationToken)

    const token = signToken(newUser._id?.toString());

    res.status(201).json(jsonResponse("User account created successfully", "", {
        token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
        }
      }));

  } catch (err: any) {
    logger(`Error Creating user account: ${err}`)
    res.status(500).json(jsonResponse('Failed to create user account'));
  }
};


export const login = async (req: IRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })

    const isPasswordMatched = await user?.comparePassword(password)
    if (!user || !isPasswordMatched) {
      return res.status(401).json(jsonResponse('Incorrect email or password'));
    }

    if (!user?.isEmailVerified) {
      //resend verification email
      const verificationToken  = crypto.randomBytes(32).toString('hex')
      user.emailVerificationToken = verificationToken
      await user.save();
      sendVerificationEmail(email,  verificationToken)
      return res.status(403).json(jsonResponse("Please check your inbox to verify your email"))
    }

    // 3. If everything ok, send token to client
    const token = signToken(user._id?.toString());

    (user as any).password = null;
    res.status(200).json(jsonResponse("User logged in successfully", "", {
        token,
        user: user
    } ));
  } catch (err: any) {
    logger(`Error trying to login user: ${err}`)
    res.status(500).json(jsonResponse("Failed to login User"));
  }
};

export const getMe = async (req: IRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
        return res.status(404).json(jsonResponse("User account not found"))
    }
    res.status(200).json(jsonResponse("User profile fetched successfully", "" ,  user));
 
} catch (err: any) {
    logger(`Error fetching user profile ${err}`)
    res.status(500).json(jsonResponse("Failed to fetch user profile"));
  }
};


export const verifyEmail = async (req:IRequest, res:Response) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.status(400).json(jsonResponse('Invalid verification token' ));
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = '';
    await user.save();

    res.status(200).json(jsonResponse('Email verified successfully' ));

  } catch (error) {
    res.status(500).json(jsonResponse("Email Verification failed"));
  }
};

