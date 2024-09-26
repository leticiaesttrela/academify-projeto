import { Router } from "express";
import { UserController } from "./controllers/userController";
import { userAuth } from "./middlewares/auth";
import { ClassController } from "./controllers/classController";
import { TeacherController } from "./controllers/teacherController";
import { StudentController } from "./controllers/studentController";
import { parserFile } from "./lib/multer";

const router = Router();

const userController = new UserController();
const classController = new ClassController();
const studentController = new StudentController();
const teacherController = new TeacherController();

router.post('/users', userController.create);
router.post('/sessions', userController.login);
router.get('/me', userAuth, userController.getUser);
router.patch('/me/avatar', parserFile, userAuth, userController.updateImage);

router.get('/classes', userAuth, classController.fetchClasses);
router.get('/classes/:id', userAuth, classController.getClass);
router.get('/classes/:id/students', userAuth, classController.getClassStudents);
router.post('/classes', userAuth, classController.createClass);
router.put('/classes/:id', userAuth, classController.updateClass);
router.delete('/classes/:id', userAuth, classController.deleteClass);
router.patch('/classes/:id/student', userAuth, classController.addStudent);
router.delete('/classes/:id/student', userAuth, classController.removeStudent);

router.get('/students', userAuth, studentController.fetchStudents);
router.get('/students/:id', userAuth, studentController.getStudent);
router.post('/students', userAuth, studentController.createStudent);
router.put('/students/:id', userAuth, studentController.updateStudent);
router.delete('/students/:id', userAuth, studentController.deleteStudent);

router.get('/teachers', userAuth, teacherController.fetchTeachers);
router.get('/teachers/:id', userAuth, teacherController.getTeacher);
router.post('/teachers', userAuth, teacherController.createTeacher);
router.put('/teachers/:id', userAuth, teacherController.updateTeacher);
router.delete('/teachers/:id', userAuth, teacherController.deleteTeacher);

export { router };
