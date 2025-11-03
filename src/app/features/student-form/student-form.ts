import { Component, OnInit, inject, input, signal, computed, effect } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { CreateStudentDto, Student, UpdateStudentDto } from '../../core/models/student';
import { HttpErrorResponse } from '@angular/common/http';
import { Department } from '../../core/models/department';
import { Course } from '../../core/models/course';
import { filter } from 'rxjs';
import { ReplaceUnderscorePipe } from '../../shared/pipes/replace-underscore.pipe';
import { NgSelectModule } from '@ng-select/ng-select';

type FormState = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string | string[]; 
};

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, ReplaceUnderscorePipe, NgSelectModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss',
})
export default class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  readonly state = signal<FormState>({ status: 'idle', message: '' });
  studentId = input<string>();
  isEditMode = false;
  private studentToEdit?: Student;

  readonly departments = signal<Department[]>([]);
  readonly courses = signal<Course[]>([]);

  readonly isDepartmentSelected = computed(
    () => this.studentForm.get('departmentId')?.value != null
  );

  readonly departmentOptions = computed(() =>
    this.departments().map((dept) => ({
      label: dept.name,
      value: dept.id,
    }))
  );

  studentForm = this.fb.group({
    studentId: ['', [Validators.required, Validators.maxLength(100)]],
    firstName: [ '', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]*$')]],
    lastName: [ '', [Validators.required, Validators.minLength(2), Validators.pattern('^[a-zA-Z ]*$')]],
    email: ['', [Validators.required, Validators.email]],
    departmentId: [null as number | null, Validators.required],
    courseIds: [[] as number[], Validators.minLength(1)],
  });

  constructor() {
    this.studentForm
      .get('departmentId')
      ?.valueChanges.pipe(
        filter((value): value is number => value != null)
      )
      .subscribe((departmentId) => {
        this.loadCoursesByDepartment(departmentId);
      });
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.studentToEdit = history.state?.student;
    const id = this.studentId();

    if (id && this.studentToEdit) {
      this.isEditMode = true;
      if (this.studentToEdit.department && !this.studentToEdit.department.active) {
          this.departments.update(deps => [this.studentToEdit!.department, ...deps]);
      }

      this.studentForm.patchValue({
        firstName: this.studentToEdit.firstName,
        lastName: this.studentToEdit.lastName,
        email: this.studentToEdit.email,
        departmentId: this.studentToEdit.department?.id ?? null,
        courseIds: this.studentToEdit.courses?.map((c) => c.id) ?? [],
      });
      this.studentForm.controls.studentId.setValue(this.studentToEdit.studentId);
      this.studentForm.controls.studentId.disable();
    }
  }

  loadDepartments(): void {
    this.apiService.getActiveDepartments().subscribe({
      next: (response) => this.departments.set(response.data),
      error: (err) => this.handleError(err, 'Failed to load departments.'),
    });
  }

  loadCoursesByDepartment(departmentId: number): void {
    this.courses.set([]);
    this.studentForm.get('courseIds')?.setValue([]);

    this.apiService.getCourses(departmentId).subscribe({
      next: (response) => this.courses.set(response.data),
      error: (err) =>
        this.handleError(err, `Failed to load courses for department ${departmentId}.`),
    });
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.state.set({ status: 'submitting', message: '' });
    const formValue = this.studentForm.getRawValue();

    const studentData = {
      ...formValue,
      courseIds: formValue.courseIds ?? [],
    };

    const apiCall = this.isEditMode
      ? this.apiService.updateStudent(this.studentId()!, studentData as UpdateStudentDto)
      : this.apiService.addStudent(studentData as CreateStudentDto);

    apiCall.subscribe({
      next: () => {
        const successMessage = `Student ${this.isEditMode ? 'updated' : 'added'} successfully!`;
        this.state.set({ status: 'success', message: successMessage });
        setTimeout(() => this.router.navigate(['/students']), 1500);
      },
      error: (err) => this.handleError(err),
    });
  }

  private handleError(
    err: HttpErrorResponse,
    defaultMessage: string = 'An unknown error occurred.'
  ): void {
    let message: string | string[] = defaultMessage;
    if (err.error?.data?.errors && Array.isArray(err.error.data.errors)) {
      message = err.error.data.errors;
    } else if (err.error?.message) {
      message = err.error.message;
    }
    this.state.set({ status: 'error', message });
    console.error(err);
  }

  isArray(msg: any): msg is any[] {
    return Array.isArray(msg);
  }

  getControl(name: string): FormControl {
    return this.studentForm.get(name) as FormControl;
  }

  isControlInvalid(name: string): boolean {
    const control = this.getControl(name);
    return (
      !!control && control.invalid && (control.touched || this.state().status === 'submitting')
    );
  }
}