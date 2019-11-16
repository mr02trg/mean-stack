import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

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
    this.http.get<{message: string, posts: IPost[]}>('http://localhost:3000/api/posts')
        .subscribe(res => {
          this.posts = res.posts;
          this.postSubject.next(this.posts);
        })
  }

  AddPost(postData: IPost) {
    this.http.post<{message: string}>('http://localhost:3000/api/posts', postData)
        .subscribe(res => {
          this.posts.push(postData);
          this.postSubject.next(this.posts);
        });
  }
}
