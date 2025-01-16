import {InjectionToken} from '@angular/core';

export const MIN_LOADING_TIME = new InjectionToken<number>(
  'Minimum loading time for requests',
  {factory: () => 350}
);
