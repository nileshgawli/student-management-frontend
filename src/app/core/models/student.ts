import { Course } from './course';
import { Department } from './department';

export interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  courses: Course[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDto {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  courseIds: number[];
}

export interface UpdateStudentDto {
  firstName: string;
  lastName: string;
  email: string;
  departmentId: number;
  courseIds: number[];
}