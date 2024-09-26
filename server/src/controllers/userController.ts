import { compare } from "bcrypt";
import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { prisma } from "../lib/prisma";
import { hash } from "bcrypt";
import { deleteFile, uploadFile } from "../lib/multer";

export class UserController {
  login = async(req: Request, res: Response) => {
    const email = req.body.email as string;
    const password = req.body.password as string;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email.toLowerCase() } }
    });

    if(!user){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const comparePassword = await compare(password, user.password);
    
    if(!comparePassword){
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h'
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      },
    });
  }

  create = async(req: Request, res: Response) => {
    const email = req.body.email as string;
    const password = req.body.password as string;

    const user = await prisma.user.findFirst({
      where: { email: { equals: email.toLowerCase() } },
    });

    if(user){
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await hash(password, 8);

    await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: passwordHash
      }
    });

    return res.status(201).json({ message: 'User created' });
  }

  getUser = async(req: Request, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.userId }
    });

    if(!user){
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
      },
    });
  }

  updateImage = async(req: Request, res: Response) => {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.userId } });

      if (user) {
        const imageUrl = (await uploadFile(req, res)) as string | undefined;

        if (!imageUrl){
          throw new Error('File cannot be empty');
        }

        await prisma.user.update({ where: { id: req.userId }, data: { imageUrl } });

        await deleteFile(user?.imageUrl as string);

        return res.json({ imageUrl });
      }
    } catch (error) {
      if (error instanceof Error) {
        const errorMessage = error.message;

        console.log(errorMessage)

        return res.status(400).json({ message: errorMessage });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}