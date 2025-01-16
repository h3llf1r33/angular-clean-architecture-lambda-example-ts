import {Injectable} from '@angular/core';
import {PostRepository} from '../repositories/post.repository';
import {take} from 'rxjs';
import {IPost} from '../interfaces/IPost';

@Injectable()
export class PostService {

  constructor(private repository: PostRepository) {
  }

  public updatePostById(id: number, query: Partial<IPost>, loadingStateUpdateFunc: (loading: boolean) => void, refreshFunc: () => void): void {
    loadingStateUpdateFunc(true);
    this.repository.updatePostById(String(id), query).pipe(take(1)).subscribe(() => {
      loadingStateUpdateFunc(false);
      refreshFunc();
    })
  }

  public createPost(query: Partial<IPost>, loadingStateUpdateFunc: (loading: boolean) => void, refreshFunc: () => void): void {
    loadingStateUpdateFunc(true);
    this.repository.createPost(query).pipe(take(1)).subscribe(() => {
      loadingStateUpdateFunc(false);
      refreshFunc();
    })
  }

  public deletePostById(id: number, loadingStateUpdateFunc: (loading: boolean) => void, refreshFunc: () => void): void {
    loadingStateUpdateFunc(true);
    this.repository.deletePostById(id).pipe(take(1)).subscribe(() => {
      loadingStateUpdateFunc(false);
      refreshFunc();
    })
  }

}
