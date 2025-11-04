import { Injectable, inject } from '@angular/core';
import { ApiService, QueryParams } from './api.service';
import { Observable } from 'rxjs';
import { ApiResponse, Page } from '../models/api-response';
import { CreateDepartmentDto, Department, DepartmentDetail, UpdateDepartmentDto } from '../models/department';

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

  getDepartmentById(departmentId: number): Observable<ApiResponse<DepartmentDetail>> {
    return this.apiService.getDepartmentById(departmentId);
  }
  
  addDepartment(departmentData: CreateDepartmentDto): Observable<ApiResponse<Department>> {
    return this.apiService.addDepartment(departmentData);
  }

  updateDepartment(departmentId: number, departmentData: UpdateDepartmentDto): Observable<ApiResponse<DepartmentDetail>> {
    return this.apiService.updateDepartment(departmentId, departmentData);
  }

  toggleDepartmentStatus(departmentId: number): Observable<ApiResponse<Department>> {
    return this.apiService.toggleDepartmentStatus(departmentId);
  }
}