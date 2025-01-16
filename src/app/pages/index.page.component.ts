import {Component, inject, PLATFORM_ID, ViewChild} from '@angular/core';
import {AsyncPipe, isPlatformBrowser} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatCard, MatCardContent, MatCardHeader} from '@angular/material/card';
import {MatFormField, MatLabel, MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {LoremIpsum} from 'lorem-ipsum';
import {examplePost, IPost} from '../domain/interfaces/IPost';
import {
  IGenericFilterQuery,
  IOperator,
  IPaginatedResponse,
  IPaginationQuery
} from '@denis_bruns/web-core-ts';
import {EgwSourceType, PostRepository} from '../domain/repositories/post.repository';
import {PostService} from '../domain/services/post.service';
import * as PostActions from '../state/post.actions';
import * as PostSelectors from '../state/post.selectors';
import {IPaginatorStoreSettings} from '../domain/interfaces/IPaginatorStoreSettings';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-index-page',
  templateUrl: './index.page.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatSelect,
    MatButton,
    MatOption,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    MatPaginator,
    MatIcon,
    MatProgressSpinner,
  ],
  providers: [PostRepository, PostService, CookieService]
})
export class IndexPageComponent {
  @ViewChild(MatPaginator) paginator?: MatPaginator;
  protected cardsInEditMode = new Set<number>();
  protected postAttributes = Object.keys(examplePost);
  protected sortAttributes: string[] = ['asc', 'desc'];
  protected operators: IOperator[] = ['=', '<', '>', 'like', '!=', '<=', '>=', 'in', 'not in', 'not like'];
  protected posts$: Observable<IPaginatedResponse<IPost>>;
  protected loading$: Observable<boolean>;
  protected currentEgwSelection$: Observable<EgwSourceType>;
  protected paginationSettings$: Observable<IPaginatorStoreSettings>;
  protected searchForm = new FormGroup({
    field: new FormControl<keyof IPost | null>(null, [Validators.required]),
    operator: new FormControl<IOperator | null>(null, [Validators.required]),
    value: new FormControl<string>('', [Validators.required]),
    sortBy: new FormControl<keyof IPost | null>(null, []),
    sortDirection: new FormControl<'asc' | 'desc' | null>(null, []),
  });
  private readonly platformId = inject(PLATFORM_ID);
  private readonly lorem = new LoremIpsum({
    sentencesPerParagraph: {max: 8, min: 4},
    wordsPerSentence: {max: 16, min: 4}
  });

  private readonly cookieService = inject(CookieService);
  private readonly FILTER_COOKIE_KEY = 'post-filter-state';

  constructor(
    private store: Store,
    protected readonly postRepository: PostRepository,
    protected readonly postService: PostService
  ) {
    this.posts$ = this.store.select(PostSelectors.selectPosts);
    this.loading$ = this.store.select(PostSelectors.selectLoading);
    this.currentEgwSelection$ = this.store.select(PostSelectors.selectDataSource);
    this.paginationSettings$ = this.store.select(PostSelectors.selectPaginationSettings);
    if (isPlatformBrowser(this.platformId)) {
      const savedFilter = this.cookieService.get(this.FILTER_COOKIE_KEY);
      if (savedFilter) {
        try {
          const filterState = JSON.parse(savedFilter);
          this.searchForm.patchValue(filterState);
        } catch (e) {
          console.error('Error parsing saved filter state:', e);
        }
      }
    }
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(PostActions.setDataSource({source: 'dynamoDb'}));
      this.loadPosts();
    }
  }

  protected swapDataSource(selection: EgwSourceType): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(PostActions.setDataSource({source: selection}));
    }
  }

  protected loadPosts(event?: PageEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      const {field, operator, value, sortBy, sortDirection} = this.searchForm.value;

      const paginationQuery: IPaginationQuery = {
        page: event ? event.pageIndex + 1 : 1,
        offset: event ? event.pageIndex * (this.paginator?.pageSize || event?.pageSize || 10) : 0,
        limit: this.paginator?.pageSize || event?.pageSize || 10,
        ...(sortBy ? {
          sortBy,
          sortDirection: sortDirection || 'asc'
        } : {})
      };

      const filterQuery: IGenericFilterQuery = {
        filters: this.isValid() ? [{
          field: field!,
          operator: operator!,
          value: value!
        }] : [],
        pagination: paginationQuery
      };

      this.cookieService.set(this.FILTER_COOKIE_KEY, JSON.stringify({
        field,
        operator,
        value,
        sortBy,
        sortDirection
      }));

      this.store.dispatch(PostActions.setCurrentFilter({ filterQuery }));
      this.store.dispatch(PostActions.updatePaginationSettings({
        settings: {
          page: paginationQuery.page || 1,
          offset: paginationQuery.offset || 0,
          limit: paginationQuery.limit || 10,
          sortBy: sortBy || undefined,
          sortDirection: sortDirection || undefined,
          pageSizeOptions: [5, 10, 25, 100]
        }
      }));

      this.store.dispatch(PostActions.loadPosts({ filterQuery }));
    }
  }

  protected isValid(): boolean {
    return this.searchForm.valid;
  }

  protected createRandomPost(): void {
    if (isPlatformBrowser(this.platformId)) {
      const post = {
        userId: Math.ceil(Math.random()),
        body: this.lorem.generateWords(35),
        title: this.lorem.generateWords(3),
      };

      this.store.dispatch(PostActions.createPost({post}));
    }
  }

  protected updatePost(id: number, changes: Partial<IPost>): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(PostActions.updatePost({id: String(id), changes}));
      this.cardsInEditMode.delete(id);
    }
  }

  protected deletePost(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(PostActions.deletePost({id}));
    }
  }

  protected handlePagination(event: PageEvent): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(PostActions.updatePaginationSettings({
        settings: {
          page: event.pageIndex + 1,
          limit: event.pageSize
        }
      }));
      this.loadPosts(event);
    }
  }
}
