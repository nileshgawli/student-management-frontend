import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response';
import { CreateStudentDto, Student, UpdateStudentDto } from '../models/student';

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
  private readonly apiUrl = 'http://localhost:8080/api/v1/students';

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

    return this.http.get<ApiResponse<Page<Student>>>(this.apiUrl, { params });
  }

  addStudent(studentData: CreateStudentDto): Observable<ApiResponse<Student>> {
    return this.http.post<ApiResponse<Student>>(this.apiUrl, studentData);
  }

  updateStudent(studentId: string, studentData: UpdateStudentDto): Observable<ApiResponse<Student>> {
    return this.http.put<ApiResponse<Student>>(`${this.apiUrl}/${studentId}`, studentData);
  }

  toggleStudentStatus(studentId: string): Observable<ApiResponse<Student>> {
    return this.http.patch<ApiResponse<Student>>(`${this.apiUrl}/${studentId}/toggle-status`, {});
  }
}