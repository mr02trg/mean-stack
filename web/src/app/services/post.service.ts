import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, remove } from 'lodash';

import { IPost } from '../models/IPost';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient
  ) { }

  posts: IPost[] = [];
  postSubject: BehaviorSubject<IPost[]> = new BehaviorSubject(this.posts);

  getPosts() {
    return this.postSubject.asObservable();
  }

  // api 
  GetPosts() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(rxMap((postData) => {
            return map(postData.posts, p => {
              return {
                title: p.title,
                content: p.content,
                id: p._id
              }
            });
          }))
        .subscribe(res => {
          this.posts = res;
          this.postSubject.next(this.posts);
        })
  }

  AddPost(postData: IPost) {
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', postData)
        .subscribe(res => {
          postData.id = res.postId;
          this.posts.push(postData);
          this.postSubject.next(this.posts);
        });
  }

  DeletePost(id: string) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`)
    .subscribe(res => {
      remove(this.posts, x => x.id == id);
      this.postSubject.next(this.posts);
    }, err => {
      console.error('Failed to delete');
    });
  }
}
