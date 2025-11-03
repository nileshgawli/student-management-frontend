export interface Department {
  id: number;
  name: string;
  active: boolean;
}

// --- DTOs for the Department Form ---

// Represents a course when creating a new department.
export interface CourseNestedDto {
  name: string;
  description?: string;
}

// DTO for creating a department.
export interface CreateDepartmentDto {
  name: string;
  courses: CourseNestedDto[];
  status: boolean;
}

// DTO for updating a department's name.
export interface UpdateDepartmentDto {
  name: string;
  status: boolean;
}