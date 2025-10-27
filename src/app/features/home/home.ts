import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-800 dark:text-white">Welcome to the Student Management System</h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-300">Choose an option below to get started.</p>
    </div>

    <div class="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <!-- View Students Card -->
      <a routerLink="/students" class="group block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div class="flex items-center justify-center h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
          <i class="fa-solid fa-list-ul text-3xl text-blue-600 dark:text-blue-400"></i>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">View Student List</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Browse, search, and manage all registered students.</p>
        <div class="mt-6 text-blue-600 dark:text-blue-400 font-semibold group-hover:underline">
          Go to List <i class="fa-solid fa-arrow-right ml-2"></i>
        </div>
      </a>

      <!-- Add Student Card -->
      <a routerLink="/students/new" class="group block p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
        <div class="flex items-center justify-center h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full mb-6">
          <i class="fa-solid fa-user-plus text-3xl text-green-600 dark:text-green-400"></i>
        </div>
        <h2 class="text-2xl font-semibold text-gray-900 dark:text-white">Add a New Student</h2>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Enroll a new student into the system with their details.</p>
        <div class="mt-6 text-green-600 dark:text-green-400 font-semibold group-hover:underline">
          Open Form <i class="fa-solid fa-arrow-right ml-2"></i>
        </div>
      </a>
    </div>
  `,
})
export default class HomeComponent {}