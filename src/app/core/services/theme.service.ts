import { DOCUMENT } from '@angular/common';
import { effect, inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly localStorageKey = 'app-theme';

  // A signal to hold the current theme state.
  currentTheme = signal<Theme>(this.getInitialTheme());

  constructor() {
    // Effect to apply the theme whenever the signal changes.
    effect(() => {
      this.applyTheme(this.currentTheme());
    });
  }

  private getInitialTheme(): Theme {
    // 1. Check for a saved theme in localStorage.
    const savedTheme = localStorage.getItem(this.localStorageKey) as Theme | null;
    if (savedTheme) {
      return savedTheme;
    }

    // 2. If no saved theme, check the user's OS preference.
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    // 3. Default to 'light'.
    return 'light';
  }

  /**
   * Toggles the current theme between 'light' and 'dark'.
   */
  toggleTheme(): void {
    this.currentTheme.update(oldTheme => (oldTheme === 'light' ? 'dark' : 'light'));
  }

  /**
   * Applies the selected theme to the document and saves it to localStorage.
   * @param theme The theme to apply ('light' or 'dark').
   */
  private applyTheme(theme: Theme): void {
    localStorage.setItem(this.localStorageKey, theme);
    this.document.documentElement.setAttribute('data-theme', theme);
  }
}