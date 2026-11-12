import { Injectable } from '@angular/core'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'sasjs-theme'

/**
 * Light and dark, one token set in `styles.scss` and a `data-theme` on `<html>`.
 *
 * The initial value is set by a small inline script in `index.html` before the
 * app boots, so the first paint is already the right theme; this service reads
 * the same sources and takes over from there.
 */
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  public theme: Theme = 'light'

  constructor() {
    this.theme = this.stored() || this.preferred()
    this.apply()
  }

  public toggle() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark'
    this.apply()

    try {
      localStorage.setItem(STORAGE_KEY, this.theme)
    } catch {
      /* private mode: the choice lasts for the session, which is fine */
    }
  }

  private apply() {
    document.documentElement.setAttribute('data-theme', this.theme)
  }

  private stored(): Theme | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY)
      return value === 'light' || value === 'dark' ? value : null
    } catch {
      return null
    }
  }

  private preferred(): Theme {
    return window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
}
