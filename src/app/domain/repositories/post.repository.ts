import {Inject, Injectable, makeStateKey, PLATFORM_ID, StateKey, TransferState} from '@angular/core';
import {isPlatformServer} from '@angular/common';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';
import {IGenericFilterQuery, IPaginatedResponse, IPaginationQuery} from '@denis_bruns/web-core-ts';
import {PostCrudGateway} from '../gateways/post-crud.gateway';
import {IPost} from '../interfaces/IPost';
import {HttpClient} from '@angular/common/http';

const POST_KEY = makeStateKey<IPost>('post');
const POSTS_LIST_KEY = makeStateKey<IPaginatedResponse<IPost>>('posts-list');

export type EgwSourceType = 'dynamoDb' | 'jsonPlaceholder';

@Injectable()
export class PostRepository {
  public readonly egw: BehaviorSubject<PostCrudGateway>;
  public readonly currentEgwSelection: BehaviorSubject<EgwSourceType> = new BehaviorSubject<EgwSourceType>('dynamoDb');
  private readonly jsonPlaceholderEgw: PostCrudGateway;
  private readonly dynamoDbEgw: PostCrudGateway;

  constructor(
    private readonly http: HttpClient,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.jsonPlaceholderEgw = new PostCrudGateway('jsonPlaceholder', http);
    this.dynamoDbEgw = new PostCrudGateway('dynamoDb', this.http);
    this.egw = new BehaviorSubject(
      this.currentEgwSelection.value === 'dynamoDb' ? this.dynamoDbEgw : this.jsonPlaceholderEgw
    );
  }

  public selectEgw(selection: EgwSourceType): void {
    this.currentEgwSelection.next(selection);
    if (selection === 'dynamoDb') {
      this.egw.next(this.dynamoDbEgw);
    } else {
      this.egw.next(this.jsonPlaceholderEgw);
    }
  }

  public findPostById(id: string): Observable<IPost> {
    const key = this.getStateKey(POST_KEY.toString(), {id});
    return this.transferData(
      key,
      this.egw.value.read(id)
    );
  }

  public getAllPosts(filters?: IGenericFilterQuery): Observable<IPaginatedResponse<IPost>> {
    const key = this.getStateKey(POSTS_LIST_KEY.toString(), filters);
    const mutableFilters = filters ? {
      filters: [...filters.filters],
      pagination: {...filters.pagination}
    } : undefined;

    return this.transferData(
      key,
      this.egw.value.readList(mutableFilters)
    );
  }

  public findPostsByUserId(userId: string, paginationQuery?: IPaginationQuery): Observable<IPaginatedResponse<IPost>> {
    const filters = {
      filters: [
        {
          field: "userId",
          operator: "=",
          value: userId
        }
      ],
      pagination: paginationQuery ?? {page: 1, offset: 0, limit: 10}
    } as IGenericFilterQuery;
    const key = this.getStateKey(POSTS_LIST_KEY.toString(), {userId, paginationQuery});
    return this.transferData(
      key,
      this.egw.value.readList(filters)
    );
  }

  public createPost(post: Partial<IPost>): Observable<IPost> {
    return this.egw.value.create(post);
  }

  public updatePostById(id: string, post: Partial<IPost>): Observable<IPost> {
    return this.egw.value.updateEntity(id, post);
  }

  public deletePostById(id: number): Observable<boolean> {
    return this.egw.value.delete(String(id));
  }

  private getStateKey(key: string, params?: any): StateKey<any> {
    const stateKey = params ? `${key}-${JSON.stringify(params)}` : key;
    return makeStateKey(stateKey);
  }

  private transferData<T>(key: StateKey<T>, request: Observable<T>): Observable<T> {
    if (isPlatformServer(this.platformId)) {
      return request.pipe(
        tap(data => this.transferState.set(key, data))
      );
    } else {
      const cachedData = this.transferState.get(key, null);
      if (cachedData) {
        this.transferState.remove(key);
        return of(cachedData);
      }
      return request;
    }
  }
}
