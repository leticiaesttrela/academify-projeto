import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export class ClassController {
  fetchClasses = async(req: Request, res: Response) => {
    const classes = await prisma.class.findMany();
    return res.json(classes);
  }

  getClass = async(req: Request, res: Response) => {
    const { id } = req.params;

    const _class = await prisma.class.findUnique({
      where: {
        id
      },
      include: {
        students: true,
        teacher: true
      }
    });

    if (!_class) {
      return res.status(400).json({ message: 'Class not found' });
    }

    const students = await prisma.classStudent.findMany({
      where: {
        classId: id
      },
      include: {
        student: true
      }
    });

    return res.json({
      id: _class.id,
      label: _class.label,
      period: _class.period,
      teacherId: _class.teacherId,
      teacherName: _class.teacher.name,
      students: students.map((student) => ({
        id: student.student.id,
        name: student.student.name
      }))
    });
  }

  createClass = async(req: Request, res: Response) => {
    const { label, period, teacher: teacherId } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId
      }
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    await prisma.class.create({
      data: {
        label,
        period,
        teacherId
      }
    });

    return res.status(201).json({ message: 'Class created' });
  }

  updateClass = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { label, period, teacher: teacherId } = req.body;

    const teacher = await prisma.teacher.findUnique({
      where: {
        id: teacherId
      }
    });

    if (!teacher) {
      return res.status(400).json({ message: 'Teacher not found' });
    }

    await prisma.class.update({
      where: {
        id
      },
      data: {
        label,
        period,
        teacherId
      }
    });

    return res.json({ message: 'Class updated' });
  }

  deleteClass = async(req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.class.delete({
      where: {
        id
      }
    });

    return res.json({ message: 'Class deleted' });
  }

  getClassStudents = async(req: Request, res: Response) => {
    const { id } = req.params;

    const students = await prisma.classStudent.findMany({
      where: {
        classId: id
      },
      include: {
        student: true
      }
    });

    return res.json(
      students.map((student) => ({
        name: student.student.name,
        id: student.studentId,
        classId: student.classId,
      })),
    );
  }

  addStudent = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { students } = req.body;

    const foundStudents = await prisma.student.findMany({
      where: {
        id: {
          in: students,
        },
      },
    });

    if (foundStudents.length !== students.length) {
      return res.status(400).json({ message: 'One or more students not found' });
    }

    const classStudentsData = students.map((studentId: string) => ({
      classId: id,
      studentId: studentId,
    }));

    await prisma.classStudent.createMany({
      data: classStudentsData,
    });

    return res.json({ message: 'Students added to class' });
  }

  removeStudent = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { students } = req.body;

    const classStudentsData = students.map((studentId: string) => ({
      classId: id,
      studentId: studentId,
    }));

    await prisma.classStudent.deleteMany({
      where: {
        classId: id,
        studentId: {
          in: students
        }
      }
    });

    return res.json({ message: 'Students removed from class' });
  }
} 