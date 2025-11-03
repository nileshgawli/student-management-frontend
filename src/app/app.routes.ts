import { Routes } from '@angular/router';
import MainLayout from './layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        title: 'Home',
        loadComponent: () => import('./features/home/home'),
      },
      // Student Routes
      {
        path: 'students',
        title: 'Student List',
        loadComponent: () => import('./features/student-list/student-list'),
      },
      {
        path: 'students/new',
        title: 'Add Student',
        loadComponent: () => import('./features/student-form/student-form'),
      },
      {
        path: 'students/edit/:studentId',
        title: 'Edit Student',
        loadComponent: () => import('./features/student-form/student-form'),
      },
      // Department Routes
      {
        path: 'departments',
        title: 'Department List',
        loadComponent: () => import('./features/department-list/department-list'),
      },
      {
        path: 'departments/new',
        title: 'Add Department',
        loadComponent: () => import('./features/department-form/department-form'),
      },
      {
        path: 'departments/edit/:departmentId',
        title: 'Edit Department',
        loadComponent: () => import('./features/department-form/department-form'),
      },
    ],
  },
  { path: '**', redirectTo: 'home' }
];