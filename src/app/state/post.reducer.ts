import {createReducer, on} from '@ngrx/store';
import * as PostActions from './post.actions';
import {PostState} from './post.types';

const initialState: PostState = {
  posts: {
    data: [],
    page: 1,
    limit: 10,
    total: 0
  },
  loading: false,
  error: null,
  dataSource: 'dynamoDb',
  pagination: {
    page: 1,
    limit: 10,
    offset: 0,
    pageSizeOptions: [5, 10, 25, 100],
    sortBy: 'id',
    sortDirection: 'desc'
  },
  currentFilter: null
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadPosts, (state, {filterQuery}) => ({
    ...state,
    loading: true,
    pagination: filterQuery?.pagination ? {
      ...state.pagination,
      page: filterQuery.pagination.page || state.pagination.page,
      limit: filterQuery.pagination.limit || state.pagination.limit
    } : state.pagination
  })),
  on(PostActions.loadPostsSuccess, (state, {posts}) => ({
    ...state,
    posts,
    loading: false,
    error: null,
    pagination: {
      ...state.pagination,
      page: posts.page || state.pagination.page,
      limit: posts.limit || state.pagination.limit
    }
  })),
  on(PostActions.loadPostsFailure, (state, {error}) => ({
    ...state,
    error,
    loading: false
  })),
  on(PostActions.setLoading, (state, {loading}) => ({
    ...state,
    loading
  })),
  on(PostActions.setDataSource, (state, {source}) => ({
    ...state,
    dataSource: source
  })),
  on(PostActions.updatePaginationSettings, (state, {settings}) => ({
    ...state,
    pagination: {
      ...state.pagination,
      ...settings
    }
  })),
  on(PostActions.createPostSuccess, PostActions.updatePostSuccess, state => ({
    ...state,
    loading: false
  })),
  on(PostActions.deletePostSuccess, (state, {id}) => ({
    ...state,
    posts: {
      ...state.posts,
      data: state.posts.data.filter(post => post.id !== id)
    },
    loading: false
  })),
  on(PostActions.setCurrentFilter, (state, { filterQuery }) => ({
    ...state,
    currentFilter: filterQuery
  }))
);
