import { Injectable, inject } from '@angular/core';
import { ApiService, QueryParams } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response';
import { CreateDepartmentDto, Department, UpdateDepartmentDto } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly apiService = inject(ApiService);

  getDepartments(queryParams: QueryParams): Observable<ApiResponse<Page<Department>>> {
    return this.apiService.getDepartments(queryParams);
  }

  getActiveDepartments(): Observable<ApiResponse<Department[]>> {
    return this.apiService.getActiveDepartments();
  }
  
  addDepartment(departmentData: CreateDepartmentDto): Observable<ApiResponse<Department>> {
    return this.apiService.addDepartment(departmentData);
  }

  updateDepartment(departmentId: number, departmentData: UpdateDepartmentDto): Observable<ApiResponse<Department>> {
    return this.apiService.updateDepartment(departmentId, departmentData);
  }

  toggleDepartmentStatus(departmentId: number): Observable<ApiResponse<Department>> {
    return this.apiService.toggleDepartmentStatus(departmentId);
  }
}