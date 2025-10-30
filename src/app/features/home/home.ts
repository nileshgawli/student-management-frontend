import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-background">
      <!-- Action Cards Section -->
      <div class="px-6 pb-16 md:pb-24">
        <div class="max-w-6xl mx-auto">
          <!-- Section Header -->
          <div class="text-center mb-12 mt-6">
            <h2 class="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Student Management System
            </h2>
            <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose an option below to manage your student database efficiently
            </p>
          </div>

          <!-- Action Cards Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <!-- View Students Card -->
            <a 
              routerLink="/students" 
              class="group relative overflow-hidden card p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-primary/20"
            >
              <!-- Background Effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Icon -->
              <div class="relative z-10 flex items-center justify-center h-20 w-20 bg-primary/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fa-solid fa-list-ul text-3xl text-primary"></i>
              </div>
              
              <!-- Content -->
              <div class="relative z-10">
                <h3 class="text-2xl font-semibold text-foreground mb-3">View Student List</h3>
                <p class="text-muted-foreground leading-relaxed">
                  Browse, search, and manage all registered students in your database with advanced filtering and sorting capabilities.
                </p>
                
                <!-- Action Indicator -->
                <div class="mt-6 flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Explore Students</span>
                  <i class="fa-solid fa-arrow-right ml-3 group-hover:ml-4 transition-all duration-300"></i>
                </div>
              </div>

              <!-- Hover Border Effect -->
              <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </a>

            <!-- Add Student Card -->
            <a 
              routerLink="/students/new" 
              class="group relative overflow-hidden card p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-accent/20"
            >
              <!-- Background Effect -->
              <div class="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <!-- Icon -->
              <div class="relative z-10 flex items-center justify-center h-20 w-20 bg-accent/10 rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300">
                <i class="fa-solid fa-user-plus text-3xl text-accent"></i>
              </div>
              
              <!-- Content -->
              <div class="relative z-10">
                <h3 class="text-2xl font-semibold text-foreground mb-3">Add New Student</h3>
                <p class="text-muted-foreground leading-relaxed">
                  Enroll a new student into the system with comprehensive details including courses, department, and contact information.
                </p>
                
                <!-- Action Indicator -->
                <div class="mt-6 flex items-center text-accent font-semibold group-hover:translate-x-2 transition-transform duration-300">
                  <span>Create Student</span>
                  <i class="fa-solid fa-arrow-right ml-3 group-hover:ml-4 transition-all duration-300"></i>
                </div>
              </div>

              <!-- Hover Border Effect -->
              <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export default class HomeComponent {}