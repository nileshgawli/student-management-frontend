import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../core/services/department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseNestedDto, Department, UpdateCourseNestedDto, UpdateDepartmentDto } from '../../core/models/department';
import { Course } from '../../core/models/course';

type FormState = { status: 'idle' | 'loading' | 'submitting' | 'success' | 'error'; message: string | string[]; };

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './department-form.html',
})
export default class DepartmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly router = inject(Router);

  readonly state = signal<FormState>({ status: 'idle', message: '' });
  departmentId = input<number>();
  isEditMode = false;

  departmentForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Z_ ]*$')]],
    courses: this.fb.array([])
  });

  get courses(): FormArray {
    return this.departmentForm.get('courses') as FormArray;
  }

  ngOnInit(): void {
    const id = this.departmentId();
    if (id) {
      this.isEditMode = true;
      this.state.set({ status: 'loading', message: '' });
      this.departmentService.getDepartmentById(id).subscribe({
        next: (response) => {
          const department = response.data;
          this.departmentForm.patchValue({
            name: department.name.replace(/_/g, ' ')
          });
          // Populate the courses FormArray
          department.courses.forEach(course => {
            this.courses.push(this.createCourseFormGroup(course.id, course.name, course.description));
          });
          this.state.set({ status: 'idle', message: '' });
        },
        error: (err) => this.handleError(err, 'Failed to load department details.')
      });
    }
  }

  // Helper to create a course form group, used for both add and edit
  private createCourseFormGroup(id: number | null, name: string, description: string): FormGroup {
    return this.fb.group({
      id: [id], // Will be null for newly added courses
      name: [name, Validators.required],
      description: [description]
    });
  }

  addCourse(): void {
    this.courses.push(this.createCourseFormGroup(null, '', ''));
  }

  removeCourse(index: number): void {
    this.courses.removeAt(index);
  }

  onSubmit(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    this.state.set({ status: 'submitting', message: '' });

    const formValue = this.departmentForm.getRawValue();
    const sanitizedDeptName = (formValue.name || '').trim().replace(/\s+/g, '_').toUpperCase();

    if (this.isEditMode) {
      const payload: UpdateDepartmentDto = {
        name: sanitizedDeptName,
        courses: formValue.courses as UpdateCourseNestedDto[]
      };
      this.departmentService.updateDepartment(this.departmentId()!, payload).subscribe({
        next: () => this.handleSuccess('updated'),
        error: (err) => this.handleError(err)
      });
    } else {
      const payload = {
        name: sanitizedDeptName,
        courses: formValue.courses as CourseNestedDto[]
      };
      this.departmentService.addDepartment(payload).subscribe({
        next: () => this.handleSuccess('added'),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(action: 'added' | 'updated'): void {
    this.state.set({ status: 'success', message: `Department ${action} successfully!` });
    setTimeout(() => this.router.navigate(['/departments']), 1500);
  }

  private handleError(err: HttpErrorResponse, defaultMessage: string = 'An unknown error occurred.'): void {
    let message: string | string[] = defaultMessage;
    if (err.error?.data?.errors && Array.isArray(err.error.data.errors)) {
      message = err.error.data.errors;
    } else if (err.error?.message) {
      message = err.error.message;
    }
    this.state.set({ status: 'error', message });
    console.error('Department form error:', err);
  }

  onNameBlur(): void {
    const nameControl = this.getControl('name');
    if (nameControl.value && !nameControl.invalid) {
      const formatted = nameControl.value.trim().replace(/\s+/g, '_').toUpperCase();
      console.log('Formatted name would be:', formatted);
    }
  }
  
  isArray = (msg: any): msg is any[] => Array.isArray(msg);
  getControl = (name: string): FormControl => this.departmentForm.get(name) as FormControl;
  isControlInvalid = (name: string): boolean => {
    const control = this.getControl(name);
    return !!control && control.invalid && (control.touched || this.state().status === 'submitting');
  };

  isCourseControlInvalid(index: number, controlName: string): boolean {
    const courseGroup = this.courses.at(index) as FormGroup;
    const control = courseGroup.get(controlName);
    return !!control && control.invalid && (control.touched || this.state().status === 'submitting');
  }
}