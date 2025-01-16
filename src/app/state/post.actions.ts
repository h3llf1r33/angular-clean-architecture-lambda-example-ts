import {createAction, props} from '@ngrx/store';
import {IPost} from '../domain/interfaces/IPost';
import {IGenericFilterQuery, IPaginatedResponse} from '@denis_bruns/web-core-ts';
import {EgwSourceType} from '../domain/repositories/post.repository';
import {IPaginatorStoreSettings} from '../domain/interfaces/IPaginatorStoreSettings';

export const updatePaginationSettings = createAction(
  '[Post] Update Pagination Settings',
  props<{ settings: Partial<IPaginatorStoreSettings> }>()
);

export const loadPosts = createAction(
  '[Post] Load Posts',
  props<{ filterQuery?: IGenericFilterQuery }>()
);

export const loadPostsSuccess = createAction(
  '[Post] Load Posts Success',
  props<{ posts: IPaginatedResponse<IPost> }>()
);

export const loadPostsFailure = createAction(
  '[Post] Load Posts Failure',
  props<{ error: any }>()
);

export const createPost = createAction(
  '[Post] Create Post',
  props<{ post: Partial<IPost> }>()
);

export const createPostSuccess = createAction(
  '[Post] Create Post Success',
  props<{ post: IPost }>()
);

export const updatePost = createAction(
  '[Post] Update Post',
  props<{ id: string; changes: Partial<IPost> }>()
);

export const updatePostSuccess = createAction(
  '[Post] Update Post Success',
  props<{ post: IPost }>()
);

export const deletePost = createAction(
  '[Post] Delete Post',
  props<{ id: number }>()
);

export const deletePostSuccess = createAction(
  '[Post] Delete Post Success',
  props<{ id: number }>()
);

export const setDataSource = createAction(
  '[Post] Set Data Source',
  props<{ source: EgwSourceType }>()
);

export const setLoading = createAction(
  '[Post] Set Loading',
  props<{ loading: boolean }>()
);

export const setCurrentFilter = createAction(
  '[Post] Set Current Filter',
  props<{ filterQuery: IGenericFilterQuery }>()
);
