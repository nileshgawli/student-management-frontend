import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly apiService = inject(ApiService);

  getDepartments(): Observable<ApiResponse<Department[]>> {
    return this.apiService.getDepartments();
  }
}