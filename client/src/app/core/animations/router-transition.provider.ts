import { Provider } from '@angular/core';
import { provideTransition } from '@angular/platform-browser/animations';

export function provideRouterTransition(): Provider {
  return provideTransition();
}