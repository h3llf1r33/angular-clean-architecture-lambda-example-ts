import {IPost} from '../domain/interfaces/IPost';
import {EgwSourceType} from '../domain/repositories/post.repository';
import {IGenericFilterQuery, IPaginatedResponse} from '@denis_bruns/web-core-ts';
import {IPaginatorStoreSettings} from '../domain/interfaces/IPaginatorStoreSettings';

export interface PostState {
  posts: IPaginatedResponse<IPost>;
  loading: boolean;
  error: any;
  dataSource: EgwSourceType;
  pagination: IPaginatorStoreSettings;
  currentFilter: IGenericFilterQuery | null;
}
