import {
  HttpClientRequestOptions,
  IEntityGatewayCrud,
  IGenericFilterQuery,
  IHttpClient,
  IPaginatedResponse
} from '@denis_bruns/web-core-ts';
import {IPost} from '../interfaces/IPost';
import {Observable} from 'rxjs';
import {Inject, Injectable} from '@angular/core';
import {environmentConfig} from '../../../environment/environment';
import {EgwSourceType} from '../repositories/post.repository';
import {EGW_SOURCE_TOKEN} from '../injectionTokens/egw.source.token';
import {HttpClient} from '@angular/common/http';
import {HttpClientAngular} from '@denis_bruns/http-client-angular';

@Injectable()
export class PostCrudGateway implements IEntityGatewayCrud<IPost, IPost, IGenericFilterQuery, string, string, string, boolean> {

  private readonly httpClient: IHttpClient;

  constructor(@Inject(EGW_SOURCE_TOKEN) private readonly egwSource: EgwSourceType,
              private readonly http: HttpClient,
  ) {
    this.httpClient = new HttpClientAngular(this.http);
  }

  create(query: Partial<IPost>, config?: HttpClientRequestOptions): Observable<IPost> {
    return this.httpClient.post<IPost>(<string>environmentConfig.entities.post.httpConfig[this.egwSource].create(), query, config);
  }

  read(entityId?: string, filterQuery?: IGenericFilterQuery, config?: HttpClientRequestOptions): Observable<IPost> {
    return this.httpClient.get<IPost>(environmentConfig.entities.post.httpConfig[this.egwSource].read(entityId), config, filterQuery);
  }

  readList(filterQuery?: IGenericFilterQuery, config?: HttpClientRequestOptions): Observable<IPaginatedResponse<IPost>> {
    return this.httpClient.get<IPaginatedResponse<IPost>>(environmentConfig.entities.post.httpConfig[this.egwSource].readList(), config, filterQuery);
  }

  replaceEntity(entityId: string, query: IPost, config?: HttpClientRequestOptions): Observable<IPost> {
    return this.httpClient.put<IPost>(environmentConfig.entities.post.httpConfig[this.egwSource].update(entityId), query, config);
  }

  updateEntity(entityId: string, query: Partial<IPost>, config?: HttpClientRequestOptions): Observable<IPost> {
    return this.httpClient.patch<IPost>(environmentConfig.entities.post.httpConfig[this.egwSource].update(entityId), query, config);
  }

  delete(entityId: string, config?: HttpClientRequestOptions): Observable<boolean> {
    return this.httpClient.delete<boolean>(environmentConfig.entities.post.httpConfig[this.egwSource].delete(entityId), config);
  }

}
