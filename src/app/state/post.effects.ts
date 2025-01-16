import {inject, Injectable, PLATFORM_ID} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {Store} from '@ngrx/store';
import {of, timer} from 'rxjs';
import {catchError, map, mergeMap, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {PostRepository} from '../domain/repositories/post.repository';
import * as PostActions from './post.actions';
import * as PostSelectors from './post.selectors';
import {IGenericFilterQuery} from '@denis_bruns/web-core-ts';
import {isPlatformBrowser} from '@angular/common';
import {MIN_LOADING_TIME} from './post.tokens';

@Injectable()
export class PostEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly postRepository = inject(PostRepository);
  private readonly platformId = inject(PLATFORM_ID);
  createPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.createPost),
      withLatestFrom(this.store.select(PostSelectors.selectPaginationSettings)),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.store.dispatch(PostActions.setLoading({loading: true}));
        }
      }),
      mergeMap(([action, paginationSettings]) =>
        this.postRepository.createPost(action.post).pipe(
          switchMap(post => timer(350).pipe(map(() => post))),
          map(post => PostActions.createPostSuccess({post})),
          tap(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
              this.store.dispatch(PostActions.loadPosts({
                filterQuery: {
                  filters: [],
                  pagination: {
                    page: paginationSettings.page,
                    limit: paginationSettings.limit,
                    offset: (paginationSettings.page - 1) * paginationSettings.limit
                  }
                }
              }));
            }
          }),
          catchError(error => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
            }
            return of(PostActions.loadPostsFailure({error}));
          })
        )
      )
    )
  );
  setDataSource$ = createEffect(() =>
      this.actions$.pipe(
        ofType(PostActions.setDataSource),
        withLatestFrom(this.store.select(PostSelectors.selectPaginationSettings)),
        tap(([data, paginationSettings]) => {
          this.postRepository.selectEgw(data.source);
          if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(PostActions.loadPosts({
              filterQuery: {
                filters: [],
                pagination: {
                  page: paginationSettings.page,
                  limit: paginationSettings.limit,
                  offset: (paginationSettings.page - 1) * paginationSettings.limit
                }
              }
            }));
          }
        })
      ),
    {dispatch: false}
  );
  private readonly minLoadingTime = inject(MIN_LOADING_TIME);
  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      withLatestFrom(this.store.select(PostSelectors.selectDataSource)),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.store.dispatch(PostActions.setLoading({loading: true}));
        }
      }),
      mergeMap(([action]) => {
        const filterQuery: IGenericFilterQuery = {
          filters: [...(action.filterQuery?.filters || [])],
          pagination: {...action.filterQuery?.pagination}
        };

        const request$ = this.postRepository.getAllPosts(filterQuery).pipe(
          map(posts => PostActions.loadPostsSuccess({posts})),
          catchError(error => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
            }
            return of(PostActions.loadPostsFailure({error}));
          })
        );

        return isPlatformBrowser(this.platformId)
          ? request$.pipe(
            switchMap(action =>
              timer(this.minLoadingTime).pipe(map(() => action))
            )
          )
          : request$;
      })
    )
  );
  updatePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.updatePost),
      withLatestFrom(
        this.store.select(PostSelectors.selectPaginationSettings),
        this.store.select(PostSelectors.selectCurrentFilter)
      ),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.store.dispatch(PostActions.setLoading({loading: true}));
        }
      }),
      mergeMap(([action, paginationSettings, currentFilter]) => {
        const request$ = this.postRepository.updatePostById(action.id, action.changes).pipe(
          map(post => PostActions.updatePostSuccess({post})),
          tap(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
              this.store.dispatch(PostActions.loadPosts({
                filterQuery: currentFilter || {
                  filters: [],
                  pagination: {
                    page: paginationSettings.page,
                    limit: paginationSettings.limit,
                    offset: (paginationSettings.page - 1) * paginationSettings.limit
                  }
                }
              }));
            }
          }),
          catchError(error => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
            }
            return of(PostActions.loadPostsFailure({error}));
          })
        );

        return isPlatformBrowser(this.platformId)
          ? request$.pipe(
            switchMap(action =>
              timer(this.minLoadingTime).pipe(map(() => action))
            )
          )
          : request$;
      })
    )
  );

  deletePost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.deletePost),
      withLatestFrom(
        this.store.select(PostSelectors.selectPaginationSettings),
        this.store.select(PostSelectors.selectCurrentFilter)
      ),
      tap(() => {
        if (isPlatformBrowser(this.platformId)) {
          this.store.dispatch(PostActions.setLoading({loading: true}));
        }
      }),
      mergeMap(([action, paginationSettings, currentFilter]) => {
        const request$ = this.postRepository.deletePostById(action.id).pipe(
          map(() => PostActions.deletePostSuccess({id: action.id})),
          tap(() => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
              this.store.dispatch(PostActions.loadPosts({
                filterQuery: currentFilter || {
                  filters: [],
                  pagination: {
                    page: paginationSettings.page,
                    limit: paginationSettings.limit,
                    offset: (paginationSettings.page - 1) * paginationSettings.limit
                  }
                }
              }));
            }
          }),
          catchError(error => {
            if (isPlatformBrowser(this.platformId)) {
              this.store.dispatch(PostActions.setLoading({loading: false}));
            }
            return of(PostActions.loadPostsFailure({error}));
          })
        );

        return isPlatformBrowser(this.platformId)
          ? request$.pipe(
            switchMap(action =>
              timer(this.minLoadingTime).pipe(map(() => action))
            )
          )
          : request$;
      })
    )
  );
}
