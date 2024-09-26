import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { createWriteStream, unlinkSync } from 'fs';
import multer from 'multer';
import { join, resolve } from 'path';
import stream, { pipeline } from 'stream';
import { promisify } from 'util';

const pump = promisify(pipeline);

const parser = multer({
  limits: {
    fileSize: 5_242_880, //5mb
  },
});

export const parserFile = async (req: Request, res: Response, next: NextFunction) => {
  parser.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: 'Error in file' });
    next();
  });
};

export const uploadFile = async (req: Request, res: Response) => {
  if (req.file) {
    const { originalname, mimetype, buffer } = req.file;

    const mimeTypeRegex = /^image\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(mimetype);

    if (isValidFileFormat) {
      try {
        const fileId = randomUUID();
        const fileName = fileId.concat(`.${originalname.split('.').pop()}`);

        const readStream = stream.Readable.from(buffer);
        const writeStream = createWriteStream(
          resolve(__dirname, '../../public/', fileName)
        );

        await pump(readStream, writeStream);

        return fileName;
      } catch (error) {
        throw new Error('Error saving file');
      }
    } else throw new Error('Invalid file format');
  } else return undefined;
};

export const deleteFile = async (imageUrl: string) => {
  try {
    const imagePath = join(__dirname, `../../public/${imageUrl}`);
    unlinkSync(imagePath);
  } catch (error) {
    return error;
  }
};
