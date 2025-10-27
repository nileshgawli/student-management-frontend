import { Component, output, input } from '@angular/core';

export type DialogState = {
  isOpen: boolean;
  title?: string;
  message?: string;
  onConfirm?: () => void;
};

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" (click)="onCancel()">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md" (click)="$event.stopPropagation()">
        <div class="p-6">
          <h3 class="text-xl font-semibold text-gray-900 dark:text-white">{{ title() }}</h3>
          <p class="mt-2 text-gray-600 dark:text-gray-300">{{ message() }}</p>
        </div>
        <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end items-center gap-4 rounded-b-lg">
          <button (click)="onCancel()" class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-600 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-500">
            Cancel
          </button>
          <button (click)="onConfirm()" class="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700">
            Confirm
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ConfirmationDialogComponent {
  title = input.required<string>();
  message = input.required<string>();
  confirm = output<void>();
  cancel = output<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}