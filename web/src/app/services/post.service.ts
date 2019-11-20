import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, remove, findIndex } from 'lodash';

import { IPost } from '../models/IPost';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router
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
                ...p,
                id: p._id
              }
            });
          }))
        .subscribe(res => {
          this.posts = res;
          this.postSubject.next(this.posts);
        })
  }

  GetPostById(id: string): Observable<IPost> {
    return this.http.get<{message: string, post: any}>(`http://localhost:3000/api/posts/${id}`)
    .pipe(
      rxMap((postData) => {
        return <IPost>{
          ...postData.post,
          id: postData.post._id
        };
      }))
  }

  AddPost(postData: IPost) {
    const formData = new FormData();
    formData.append('title', postData.title);
    formData.append('content', postData.content);
    formData.append('image', postData.image);

    this.http.post<{message: string, post: any}>('http://localhost:3000/api/posts', formData)
        .pipe(
          rxMap((postData) => {
            return <IPost> {
              ...postData.post,
              id: postData.post._id
            }
          })
        )
        .subscribe(res => {
          this.posts.push(res);
          this.postSubject.next(this.posts);
          this.router.navigate(['/']);
        }, error => {
          console.error('Failed to add post');
        });
  }

  UpdatePost(id: string, postData: IPost) {
    let request: any = null;
    if (postData.image) {
      request = new FormData();
      request.append('title', postData.title);
      request.append('content', postData.content);
      request.append('image', postData.image);
    }
    else {
      request = postData;
    }

    this.http.put<{message: string}>(`http://localhost:3000/api/posts/${id}`, request)
    .subscribe(res => {
      const index = findIndex(this.posts, x => x.id == id);
      this.posts[index] = postData;
      this.postSubject.next(this.posts);
      this.router.navigate(['/']);
    }, err => {
      console.error('Failed to update post');
    });
  }

  DeletePost(id: string) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`)
    .subscribe(res => {
      remove(this.posts, x => x.id == id);
      this.postSubject.next(this.posts);
    }, err => {
      console.error('Failed to delete post');
    });
  }
}
