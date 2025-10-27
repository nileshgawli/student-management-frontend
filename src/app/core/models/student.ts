export enum Department {
  COMPUTER_SCIENCE = 'COMPUTER_SCIENCE',
  INFORMATION_TECHNOLOGY = 'INFORMATION_TECHNOLOGY',
  ELECTRICAL_ENGINEERING = 'ELECTRICAL_ENGINEERING',
  MECHANICAL_ENGINEERING = 'MECHANICAL_ENGINEERING',
  CIVIL_ENGINEERING = 'CIVIL_ENGINEERING',
}

export interface Student {
  id: number;
  studentId: string; 
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  active: boolean; 
  createdAt: string;
  updatedAt: string; 
}

export type CreateStudentDto = Omit<Student, 'id' | 'active' | 'createdAt' | 'updatedAt'>;

export type UpdateStudentDto = Omit<Student, 'id' | 'studentId' | 'active' | 'createdAt' | 'updatedAt'>;