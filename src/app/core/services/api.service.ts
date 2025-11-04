import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response';
import { CreateStudentDto, Student, UpdateStudentDto } from '../models/student';
import { CreateDepartmentDto, Department, UpdateDepartmentDto, DepartmentDetail } from '../models/department';
import { Course } from '../models/course';

// Query Params Interfaces
export interface QueryParams {
  page: number;
  size: number;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
  filter?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1';

  private buildParams(queryParams: Partial<QueryParams>): HttpParams {
    let params = new HttpParams();
    for (const key in queryParams) {
      if (queryParams.hasOwnProperty(key)) {
        const value = (queryParams as any)[key];
        if (value !== null && value !== undefined && value !== '') {
          params = params.set(key, value.toString());
        }
      }
    }
    return params;
  }

  // --- Student Methods ---

  getStudents(queryParams: QueryParams): Observable<ApiResponse<Page<Student>>> {
    const params = this.buildParams(queryParams);
    return this.http.get<ApiResponse<Page<Student>>>(`${this.baseUrl}/students`, { params });
  }

  downloadStudents(
    format: 'xlsx' | 'csv' | 'pdf',
    queryParams: Omit<QueryParams, 'page' | 'size' | 'sortBy' | 'sortDir'>
  ): Observable<Blob> {
    const params = this.buildParams(queryParams);
    return this.http.get(`${this.baseUrl}/students/download/${format}`, {
      params,
      responseType: 'blob',
    });
  }

  addStudent(studentData: CreateStudentDto): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(`${this.baseUrl}/students`, studentData);
  }

  updateStudent(studentId: string, studentData: UpdateStudentDto): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.baseUrl}/students/${studentId}`, studentData);
  }

  toggleStudentStatus(studentId: string): Observable<ApiResponse<Student>> {
    return this.http.patch<ApiResponse<Student>>(`${this.baseUrl}/students/${studentId}/toggle-status`, {});
  }
 getDepartments(queryParams: QueryParams): Observable<ApiResponse<Page<Department>>> {
    const params = this.buildParams(queryParams);
    return this.http.get<ApiResponse<Page<Department>>>(`${this.baseUrl}/departments`, { params });
  }

  getActiveDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(`${this.baseUrl}/departments/active`);
  }

  getDepartmentById(departmentId: number): Observable<ApiResponse<DepartmentDetail>> {
    return this.http.get<ApiResponse<DepartmentDetail>>(`${this.baseUrl}/departments/${departmentId}`);
  }
  
  addDepartment(departmentData: CreateDepartmentDto): Observable<ApiResponse<Department>> {
    return this.http.post<ApiResponse<Department>>(`${this.baseUrl}/departments`, departmentData);
  }

  updateDepartment(departmentId: number, departmentData: UpdateDepartmentDto): Observable<ApiResponse<DepartmentDetail>> {
    return this.http.put<ApiResponse<DepartmentDetail>>(`${this.baseUrl}/departments/${departmentId}`, departmentData);
  }

  toggleDepartmentStatus(departmentId: number): Observable<ApiResponse<Department>> {
    return this.http.patch<ApiResponse<Department>>(`${this.baseUrl}/departments/${departmentId}/toggle-status`, {});
  }

  // --- Course Methods ---
  getCourses(departmentId?: number): Observable<ApiResponse<Course[]>> {
    let params = new HttpParams();
    if (departmentId) {
      params = params.set('departmentId', departmentId.toString());
    }
    return this.http.get<ApiResponse<Course[]>>(`${this.baseUrl}/courses`, { params });
  }
}