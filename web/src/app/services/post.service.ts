import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map as rxMap } from 'rxjs/operators';
import { map, remove, findIndex } from 'lodash';


import { IPost } from '../models/IPost';
import { IPostResponse } from '../models/IPostResponse';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  postData: IPostResponse;
  postSubject: BehaviorSubject<IPostResponse> = new BehaviorSubject(this.postData);

  getPosts() {
    return this.postSubject.asObservable();
  }

  // api 
  GetPosts(pageIndex: number, pageSize: number) {
    let params = new HttpParams();
    params = params.append('pageIndex', pageIndex.toString());
    params = params.append('pageSize', pageSize.toString());
    this.http.get<{message: string, posts: any, totalPosts: number}>('http://localhost:3000/api/posts', {params: params})
        .pipe(rxMap((postData) => {
          return <IPostResponse> {
            totalPosts: postData.totalPosts,
            posts: map(postData.posts, p => {
              return {
                ...p,
                id: p._id
              }
            })
          };
        }))
        .subscribe(res => {
          this.postData = res;
          this.postSubject.next(this.postData);
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
          this.postData.totalPosts += 1;
          this.postData.posts.push(res);
          this.postSubject.next(this.postData);
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
      const index = findIndex(this.postData, x => x.id == id);
      this.postData[index] = postData;
      this.postSubject.next(this.postData);
      this.router.navigate(['/']);
    }, err => {
      console.error('Failed to update post');
    });
  }

  DeletePost(id: string, pageIndex: number, pageSize: number) {
    this.http.delete<{message: string}>(`http://localhost:3000/api/posts/${id}`)
    .subscribe(res => {
      // reload
      this.GetPosts(pageIndex, pageSize);
    }, err => {
      console.error('Failed to delete post');
    });
  }
}
