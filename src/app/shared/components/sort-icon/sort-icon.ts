import { Component, input } from '@angular/core';

@Component({
  selector: 'app-sort-icon',
  standalone: true,
  template: `
    <span class="ml-2 text-gray-400 w-4 inline-block">
      @if (currentSort() === column()) {
        @if (currentDir() === 'ASC') {
          <i class="fa-solid fa-sort-up"></i>
        } @else {
          <i class="fa-solid fa-sort-down"></i>
        }
      } @else {
        <i class="fa-solid fa-sort"></i>
      }
    </span>
  `,
})
export class SortIconComponent {
  currentSort = input.required<string>();
  currentDir = input.required<'ASC' | 'DESC'>();
  column = input.required<string>();
}