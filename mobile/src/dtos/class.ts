type IClass = {
  id: string;
  label: string;
  period: string;
  teacherId: string;
  teacherName: string;
  students: IStudent[];
  createdAt: Date;
};