import { Course } from "./course";

export interface Department {
  id: number;
  name: string;
  active: boolean;
}

export interface DepartmentDetail extends Department {
  courses: Course[];
}

// Represents a course when creating a new department.
export interface CourseNestedDto {
  name: string;
  description?: string;
}

export interface UpdateCourseNestedDto {
  id: number | null; // Null for new courses being added during an update
  name: string;
  description?: string;
}

// DTO for creating a department.
export interface CreateDepartmentDto {
  name: string;
  courses: CourseNestedDto[];
}

// DTO for updating a department and its courses.
export interface UpdateDepartmentDto {
  name: string;
  courses: UpdateCourseNestedDto[];
}