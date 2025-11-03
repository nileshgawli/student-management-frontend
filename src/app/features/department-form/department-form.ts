import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DepartmentService } from '../../core/services/department.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CourseNestedDto, Department } from '../../core/models/department';

type FormState = { status: 'idle' | 'submitting' | 'success' | 'error'; message: string | string[]; };

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

  // State
  readonly state = signal<FormState>({ status: 'idle', message: '' });
  departmentId = input<number>();
  isEditMode = false;

  departmentForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^[a-zA-Z_ ]*$')]],
    status: [true], 
    courses: this.fb.array([])
  });

  get courses(): FormArray {
    return this.departmentForm.get('courses') as FormArray;
  }

  ngOnInit(): void {
    const id = this.departmentId();
    if (id) {
      this.isEditMode = true;
      const departmentToEdit: Department | undefined = history.state?.department;
      if (departmentToEdit) {
        const status = departmentToEdit.active !== undefined ? departmentToEdit.active : true;
        this.departmentForm.patchValue({ 
          name: departmentToEdit.name.replace(/_/g, ' '),
          status: status
        });
      } else {
        console.warn('Department state not found, consider fetching from API.');
      }
    }
  }

  addCourse(): void {
    if (this.isEditMode) return;
    const courseForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
    this.courses.push(courseForm);
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
    const coursesValue = formValue.courses as CourseNestedDto[];

    // Ensure status is a boolean
    const status = Boolean(formValue.status);

    const apiCall = this.isEditMode
      ? this.departmentService.updateDepartment(this.departmentId()!, { 
          name: sanitizedDeptName, 
          status: status
        })
      : this.departmentService.addDepartment({ 
          name: sanitizedDeptName, 
          courses: coursesValue,
          status: true // New departments are always active
        });

    apiCall.subscribe({
      next: () => {
        const successMessage = `Department ${this.isEditMode ? 'updated' : 'added'} successfully!`;
        this.state.set({ status: 'success', message: successMessage });
        setTimeout(() => this.router.navigate(['/departments']), 1500);
      },
      error: (err) => this.handleError(err),
    });
  }

  onNameBlur(): void {
    const nameControl = this.getControl('name');
    if (nameControl.value && !nameControl.invalid) {
      const formatted = nameControl.value.trim().replace(/\s+/g, '_').toUpperCase();
      console.log('Formatted name would be:', formatted);
    }
  }

  // Helper methods
  private handleError(err: HttpErrorResponse): void {
    let message: string | string[] = 'An unknown error occurred.';
    
    if (err.error?.data?.errors && Array.isArray(err.error.data.errors)) {
      message = err.error.data.errors;
    } else if (err.error?.message) {
      message = err.error.message;
    } else if (err.error) {
      message = err.error;
    }
    
    this.state.set({ status: 'error', message });
    console.error('Department form error:', err);
  }

  isArray = (msg: any): msg is any[] => Array.isArray(msg);
  getControl = (name: string): FormControl => this.departmentForm.get(name) as FormControl;
  isControlInvalid = (name: string): boolean => {
    const control = this.getControl(name);
    return !!control && control.invalid && (control.touched || this.state().status === 'submitting');
  };

  // Course validation helper
  isCourseControlInvalid(index: number, controlName: string): boolean {
    const courseGroup = this.courses.at(index) as FormGroup;
    const control = courseGroup.get(controlName);
    return !!control && control.invalid && (control.touched || this.state().status === 'submitting');
  }
}