import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CommonModule } from '@angular/common';
import { CreateStudentDto, Department, Student, UpdateStudentDto } from '../../core/models/student';
import { HttpErrorResponse } from '@angular/common/http';

type FormState = {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message: string;
};

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './student-form.html',
  styleUrl: './student-form.scss'
})
export default class StudentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly state = signal<FormState>({ status: 'idle', message: '' });
  studentId = input<string>();
  isEditMode = false;
  private studentToEdit?: Student;

  departmentOptions = Object.entries(Department).map(([key, value]) => ({
    label: key.replace(/_/g, ' '),
    value: value,
  }));

  studentForm = this.fb.group({
    studentId: ['', [Validators.required, Validators.maxLength(100)]],
    firstName: ['', [
      Validators.required, 
      Validators.minLength(2), 
      Validators.pattern('^[a-zA-Z ]*$')
    ]],
    lastName: ['', [
      Validators.required, 
      Validators.minLength(2),
      Validators.pattern('^[a-zA-Z ]*$')
    ]],
    email: ['', [
      Validators.required, 
      Validators.email
    ]],
    department: [null as Department | null, Validators.required],
  });

  ngOnInit(): void {
    this.studentToEdit = history.state?.student;

    const id = this.studentId();
    
    if (id && this.studentToEdit) {
      this.isEditMode = true;
      this.studentForm.patchValue(this.studentToEdit);
      this.studentForm.controls.studentId.disable();
    }
  }

  onSubmit(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.state.set({ status: 'submitting', message: '' });
    const formValue = this.studentForm.getRawValue();

    const apiCall = this.isEditMode
      ? this.apiService.updateStudent(this.studentId()!, formValue as UpdateStudentDto)
      : this.apiService.addStudent(formValue as CreateStudentDto);

    apiCall.subscribe({
      next: () => {
        const successMessage = this.isEditMode ? 'Student updated successfully!' : 'Student added successfully!';
        this.state.set({ status: 'success', message: successMessage });
        setTimeout(() => this.router.navigate(['/students']), 1500);
      },
      error: (err: HttpErrorResponse) => {
        const errorMessage = err.error?.message || 'An unknown error occurred.';
        this.state.set({ status: 'error', message: errorMessage });
      },
    });
  }

  getControl(name: string): FormControl {
    return this.studentForm.get(name) as FormControl;
  }

  isControlInvalid(name: string): boolean {
    const control = this.getControl(name);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}