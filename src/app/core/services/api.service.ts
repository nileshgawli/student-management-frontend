import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response';
import { CreateStudentDto, Student, UpdateStudentDto } from '../models/student';
import { Department } from '../models/department';
import { Course } from '../models/course';

export interface StudentQueryParams {
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

  // --- Student Methods ---

  getStudents(queryParams: StudentQueryParams): Observable<ApiResponse<Page<Student>>> {
    let params = new HttpParams()
      .set('page', queryParams.page.toString())
      .set('size', queryParams.size.toString())
      .set('sortBy', queryParams.sortBy)
      .set('sortDir', queryParams.sortDir);

    if (queryParams.filter) {
      params = params.set('filter', queryParams.filter);
    }
    if (queryParams.isActive !== undefined && queryParams.isActive !== null) {
      params = params.set('isActive', queryParams.isActive.toString());
    }

    return this.http.get<ApiResponse<Page<Student>>>(`${this.baseUrl}/students`, { params });
  }

  downloadStudents(
    format: 'xlsx' | 'csv',
    queryParams: Omit<StudentQueryParams, 'page' | 'size' | 'sortBy' | 'sortDir'>
  ): Observable<Blob> {
    let params = new HttpParams();

    if (queryParams.filter) {
      params = params.set('filter', queryParams.filter);
    }
    if (queryParams.isActive !== undefined && queryParams.isActive !== null) {
      params = params.set('isActive', queryParams.isActive.toString());
    }

    const endpoint = format === 'xlsx' ? 'xlsx' : 'csv';
    return this.http.get(`${this.baseUrl}/students/download/${endpoint}`, {
      params,
      responseType: 'blob', // Important for file downloads
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

  // --- Department Methods ---

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.http.get<ApiResponse<Department[]>>(`${this.baseUrl}/departments`);
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