import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sort-icon',
  standalone: true,
  template: `
    <span class="ml-2 inline-flex items-center justify-center w-4 h-4 transition-all duration-200">
      @if (currentSort() === column()) {
        @if (currentDir() === 'ASC') {
          <i class="fa-solid fa-sort-up text-primary" title="Sorted ascending"></i>
        } @else {
          <i class="fa-solid fa-sort-down text-primary" title="Sorted descending"></i>
        }
      } @else {
        <i class="fa-solid fa-sort text-muted-foreground opacity-60 hover:opacity-100 transition-opacity duration-200" title="Click to sort"></i>
      }
    </span>
  `,
})
export class SortIconComponent {
  currentSort = input.required<string>();
  currentDir = input.required<'ASC' | 'DESC'>();
  column = input.required<string>();
}