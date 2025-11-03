import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Department } from '../../core/models/department';
import { DepartmentService } from '../../core/services/department.service';
import { QueryParams } from '../../core/services/api.service';
import { ConfirmationDialogComponent, DialogState } from '../../shared/components/confirmation-dialog/confirmation-dialog';
import { SortIconComponent } from '../../shared/components/sort-icon/sort-icon';
import { ReplaceUnderscorePipe } from '../../shared/pipes/replace-underscore.pipe';
import { HttpErrorResponse } from '@angular/common/http';

export type DepartmentListViewState = {
  departments: Department[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
};

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TitleCasePipe,
    ReplaceUnderscorePipe,
    SortIconComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './department-list.html',
})
export default class DepartmentListComponent {
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);

  // State Management
  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly sortBy = signal('name');
  readonly sortDir = signal<'ASC' | 'DESC'>('ASC');
  readonly filterText = signal('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  readonly viewState = signal<DepartmentListViewState>({
    departments: [],
    loading: true,
    error: null,
    totalElements: 0,
    totalPages: 0,
  });
  
  readonly confirmDialogState = signal<DialogState>({ isOpen: false });
  private readonly filterSubject = new Subject<string>();

  constructor() {
    // Reactively fetch data when any state signal changes
    effect(() => {
      const queryParams: QueryParams = {
        page: this.currentPage(),
        size: this.pageSize(),
        sortBy: this.sortBy(),
        sortDir: this.sortDir(),
        filter: this.filterText(),
        isActive: this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
      };
      this.fetchDepartments(queryParams);
    });

    // Debounce search input
    this.filterSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.currentPage.set(0);
      this.filterText.set(filterValue);
    });
  }

  private fetchDepartments(params: QueryParams): void {
    this.viewState.update(s => ({ ...s, loading: true, error: null }));
    this.departmentService.getDepartments(params).subscribe({
      next: (response) => {
        this.viewState.set({
          departments: response.data.content,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          loading: false,
          error: null,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.viewState.update(s => ({
          ...s,
          error: 'Failed to fetch departments. Please try again later.',
          loading: false,
        }));
        console.error(err);
      },
    });
  }

  // Event Handlers
  onFilterChange(value: string) { this.filterSubject.next(value); }
  onStatusChange(status: 'all' | 'active' | 'inactive') { this.currentPage.set(0); this.statusFilter.set(status); }
  onPageChange(page: number) { this.currentPage.set(page); }
  onSizeChange(size: number) { this.currentPage.set(0); this.pageSize.set(size); }

  onSortChange(column: string) {
    if (this.sortBy() === column) {
      this.sortDir.update(dir => dir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sortBy.set(column);
      this.sortDir.set('ASC');
    }
  }

  onEdit(department: Department) {
    this.router.navigate(['/departments/edit', department.id], { state: { department } });
  }

  onToggleStatus(department: Department) {
    const action = department.active ? 'Deactivate' : 'Activate';
    const message = department.active 
      ? `This will also deactivate all associated courses. Are you sure you want to deactivate ${department.name}?`
      : `Are you sure you want to activate ${department.name}?`;

    this.confirmDialogState.set({
      isOpen: true,
      title: `${action} Department`,
      message: message,
      onConfirm: () => {
        this.departmentService.toggleDepartmentStatus(department.id).subscribe({
          next: (updatedDept) => {
            this.viewState.update(s => ({
              ...s,
              departments: s.departments.map(d => d.id === updatedDept.data.id ? updatedDept.data : d)
            }));
          },
          error: (err) => console.error(err)
        });
        this.closeConfirmDialog();
      }
    });
  }

  closeConfirmDialog() {
    this.confirmDialogState.set({ isOpen: false });
  }
}