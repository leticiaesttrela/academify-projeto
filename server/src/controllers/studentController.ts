import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class StudentController {
  fetchStudents = async(req: Request, res: Response) => {
    const students = await prisma.student.findMany();
    return res.json(students);
  }

  getStudent = async(req: Request, res: Response) => {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    return res.json(student);
  }

  createStudent = async(req: Request, res: Response) => {
    const { name, registration, email, phone } = req.body;

    const [studentByRegistration, studentByEmail, studentByPhone] =
      await Promise.all([
        prisma.student.findUnique({
          where: {
            registration,
          },
        }),
        prisma.student.findUnique({
          where: {
            email,
          },
        }),
        prisma.student.findUnique({
          where: {
            phone,
          },
        }),
      ]);

    if (studentByRegistration || studentByEmail || studentByPhone) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    await prisma.student.create({
      data: {
        registration,
        name,
        email,
        phone,
      }
    });

    return res.status(201).json({ message: 'Student created' });
  }

  updateStudent = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { name, registration, email, phone } = req.body;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const [studentByRegistration, studentByEmail, studentByPhone] =
      await Promise.all([
        prisma.student.findUnique({
          where: {
            registration,
          },
        }),
        prisma.student.findUnique({
          where: {
            email,
          },
        }),
        prisma.student.findUnique({
          where: {
            phone,
          },
        }),
      ]);

    if (
      (studentByRegistration && studentByRegistration.id !== student.id) ||
      (studentByEmail && studentByEmail.id !== student.id) ||
      (studentByPhone && studentByPhone.id !== student.id)
    ) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    await prisma.student.update({
      where: {
        id,
      },
      data: {
        registration,
        name,
        email,
        phone,
      },
    });

    return res.json({ message: 'Student updated' });
  }

  deleteStudent = async(req: Request, res: Response) => {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
    });

    if (!student) {
      return res.status(400).json({ message: 'Student not found' });
    }

    const isStudentInClass = await prisma.classStudent.findFirst({
      where: {
        studentId: id,
      },
    });

    if (isStudentInClass) {
      return res.status(400).json({ message: 'Student is in a class' });
    }

    await prisma.student.delete({
      where: {
        id
      }
    });

    return res.json({ message: 'Student deleted' });
  }
}