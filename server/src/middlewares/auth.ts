import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const userAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '') as string;
  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    const decoded = jwt.decode(token) as { id: string };
    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
