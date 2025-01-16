import {createFeatureSelector, createSelector} from '@ngrx/store';
import {PostState} from './post.types';

export const selectPostState = createFeatureSelector<PostState>('post');

export const selectPosts = createSelector(
  selectPostState,
  (state: PostState) => state.posts
);

export const selectLoading = createSelector(
  selectPostState,
  (state: PostState) => state.loading
);

export const selectDataSource = createSelector(
  selectPostState,
  (state: PostState) => state.dataSource
);

export const selectError = createSelector(
  selectPostState,
  (state: PostState) => state.error
);

export const selectPaginationSettings = createSelector(
  selectPostState,
  (state: PostState) => state.pagination
);

export const selectCurrentFilter = createSelector(
  selectPostState,
  (state: PostState) => state.currentFilter
);
