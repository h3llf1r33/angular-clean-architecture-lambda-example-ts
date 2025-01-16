import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {provideHttpClient, withFetch} from '@angular/common/http';
import {provideStore} from '@ngrx/store';
import {postReducer} from './state/post.reducer';
import {provideEffects} from '@ngrx/effects';
import {PostEffects} from './state/post.effects';
import {PostRepository} from './domain/repositories/post.repository';
import {PostService} from './domain/services/post.service';
import {MIN_LOADING_TIME} from './state/post.tokens';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),
    provideStore({post: postReducer}),
    provideEffects(PostEffects),
    // Provide these at the root level since they're used in effects
    PostRepository,
    PostService,
    // Minimum loading time for each request
    {provide: MIN_LOADING_TIME, useValue: 500}
  ]
};
