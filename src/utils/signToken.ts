import jwt from 'jsonwebtoken';

const signToken = (id:string) => {
  return (jwt as any).sign({id}, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN 
  }) ;
};


export default signToken;

