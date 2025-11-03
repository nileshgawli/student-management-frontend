import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { ApiService, QueryParams } from '../../core/services/api.service'; // FIX: Changed StudentQueryParams to QueryParams
import { Student } from '../../core/models/student';
import { ReplaceUnderscorePipe } from '../../shared/pipes/replace-underscore.pipe';
import { SortIconComponent } from '../../shared/components/sort-icon/sort-icon';
import { ConfirmationDialogComponent, DialogState } from '../../shared/components/confirmation-dialog/confirmation-dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { Course } from '../../core/models/course';
import { saveAs } from 'file-saver';

export type StudentListViewState = {
  students: Student[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
};

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe,
    ReplaceUnderscorePipe,
    SortIconComponent,
    ConfirmationDialogComponent,
    RouterLink,
  ],
  templateUrl: './student-list.html',
  styleUrl: './student-list.scss'
})
export default class StudentListComponent {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly currentPage = signal(0);
  readonly pageSize = signal(10);
  readonly sortBy = signal('firstName');
  readonly sortDir = signal<'ASC' | 'DESC'>('ASC');
  readonly filterText = signal('');
  readonly statusFilter = signal<'all' | 'active' | 'inactive'>('active');

  readonly viewState = signal<StudentListViewState>({
    students: [],
    loading: true,
    error: null,
    totalElements: 0,
    totalPages: 0,
  });

  private readonly filterSubject = new Subject<string>();
  readonly confirmDialogState = signal<DialogState>({ isOpen: false });

  constructor() {
    effect(() => {
      const queryParams: QueryParams = { 
        page: this.currentPage(),
        size: this.pageSize(),
        sortBy: this.sortBy(),
        sortDir: this.sortDir(),
        filter: this.filterText(),
        isActive: this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
      };
      this.fetchStudents(queryParams);
    });

    this.filterSubject.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(filterValue => {
      this.currentPage.set(0);
      this.filterText.set(filterValue);
    });
  }

  private fetchStudents(params: QueryParams): void { 
    this.viewState.update(s => ({ ...s, loading: true, error: null }));

    this.apiService.getStudents(params).subscribe({
      next: (response) => {
        this.viewState.set({
          students: response.data.content,
          totalPages: response.data.totalPages,
          totalElements: response.data.totalElements,
          loading: false,
          error: null,
        });
      },
      error: (err: HttpErrorResponse) => {
        this.viewState.update(s => ({
          ...s,
          error: 'Failed to fetch students. Please try again later.',
          loading: false,
        }));
        console.error(err);
      },
    });
  }

  onFilterChange(value: string) {
    this.filterSubject.next(value);
  }

  onStatusChange(status: 'all' | 'active' | 'inactive') {
    this.currentPage.set(0);
    this.statusFilter.set(status);
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }
  
  onSizeChange(size: number) {
    this.currentPage.set(0);
    this.pageSize.set(size);
  }

  onSortChange(column: string) {
    if (this.sortBy() === column) {
      this.sortDir.update(dir => dir === 'ASC' ? 'DESC' : 'ASC');
    } else {
      this.sortBy.set(column);
      this.sortDir.set('ASC');
    }
  }

  onEdit(student: Student) {
    this.router.navigate(['/students/edit', student.studentId], { state: { student } });
  }

  onDownload(format: 'xlsx' | 'csv'): void {
    const queryParams = {
      filter: this.filterText(),
      isActive: this.statusFilter() === 'all' ? undefined : this.statusFilter() === 'active',
    };

    this.viewState.update((s) => ({ ...s, loading: true }));

    this.apiService.downloadStudents(format, queryParams).subscribe({
      next: (blob) => {
        const fileExtension = format === 'xlsx' ? '.xlsx' : '.csv';
        saveAs(blob, `students_${new Date().toISOString().slice(0, 10)}${fileExtension}`);
        this.viewState.update((s) => ({ ...s, loading: false }));
      },
      error: (err) => {
        console.error('Download failed:', err);
        this.viewState.update((s) => ({
          ...s,
          error: 'Failed to download student list. Please try again.',
          loading: false,
        }));
      },
    });
  }

  onToggleStatus(student: Student) {
    const action = student.active ? 'Deactivate' : 'Activate';
    this.confirmDialogState.set({
      isOpen: true,
      title: `${action} Student`,
      message: `Are you sure you want to ${action.toLowerCase()} ${student.firstName} ${student.lastName}?`,
      onConfirm: () => {
        this.apiService.toggleStudentStatus(student.studentId).subscribe({
          next: (updatedStudent) => {
            this.viewState.update(s => ({
              ...s,
              students: s.students.map(st => st.id === updatedStudent.data.id ? updatedStudent.data : st)
            }));
          },
          error: (err: HttpErrorResponse) => {
            console.error(err);
            this.viewState.update(s => ({ ...s, error: 'Failed to update status.' }));
          }
        });
        this.closeConfirmDialog();
      }
    });
  }

  closeConfirmDialog() {
    this.confirmDialogState.set({ isOpen: false });
  }

  getRemainingCoursesTooltip(courses: Course[]): string {
    if (!courses || courses.length === 0) {
      return '';
    }
    return courses.map(c => c.name).join(', ');
  }
}