import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class TeacherController {
  fetchTeachers = async(req: Request, res: Response) => {
    const teachers = await prisma.teacher.findMany();
    return res.json(teachers);
  }

  getTeacher = async(req: Request, res: Response) => {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    return res.json(teacher);
  } 

  createTeacher = async(req: Request, res: Response) => {
    const { name, registration, email, phone, coords } = req.body;

    const [ teacherByRegistration, teacherByEmail, teacherByPhone ] =
      await Promise.all([
        prisma.teacher.findUnique({
          where: {
            registration,
          },
        }),
        prisma.teacher.findUnique({
          where: {
            email,
          },
        }),
        prisma.teacher.findUnique({
          where: {
            phone,
          },
        }),
      ]);

    if (teacherByRegistration || teacherByEmail || teacherByPhone) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    await prisma.teacher.create({
      data: {
        registration,
        name,
        email,
        phone,
        lat: coords.latitude,
        long: coords.longitude,
      },
    });

    return res.status(201).json({ message: 'Teacher created' });
  }

  updateTeacher = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { name, registration, email, phone, coords } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    const [teacherByRegistration, teacherByEmail, teacherByPhone] =
      await Promise.all([
        prisma.teacher.findUnique({
          where: {
            registration,
          },
        }),
        prisma.teacher.findUnique({
          where: {
            email,
          },
        }),
        prisma.teacher.findUnique({
          where: {
            phone,
          },
        }),
      ]);

    if (
      teacherByRegistration && teacherByRegistration.id !== teacher.id
      || teacherByEmail && teacherByEmail.id !== teacher.id 
      || teacherByPhone && teacherByPhone.id !== teacher.id
    ) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    await prisma.teacher.update({
      where: {
        id,
      },
      data: {
        registration,
        name,
        email,
        phone,
        lat: coords.latitude,
        long: coords.longitude,
      },
    });

    return res.json({ message: 'Teacher updated' });
  }

  deleteTeacher = async(req: Request, res: Response) => {
    const { id } = req.params;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id,
      },
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    const teacherClasses = await prisma.class.findMany({
      where: {
        teacherId: id,
      },
    });

    if (teacherClasses.length > 0) {
      return res.status(400).json({ message: 'Teacher has classes' });
    }

    await prisma.teacher.delete({
      where: {
        id
      }
    });

    return res.json({ message: 'Teacher deleted' });
  }
}