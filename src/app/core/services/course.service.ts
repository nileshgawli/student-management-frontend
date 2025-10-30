import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { Course } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly apiService = inject(ApiService);

  getCourses(departmentId?: number): Observable<ApiResponse<Course[]>> {
    return this.apiService.getCourses(departmentId);
  }
}