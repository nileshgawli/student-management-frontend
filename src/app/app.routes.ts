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
    ],
  },
  { path: '**', redirectTo: 'home' }
];