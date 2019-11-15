import { Injectable } from '@angular/core';
import { IPost } from '../models/IPost';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor() { }

  posts: IPost[] = [];
  postSubject: BehaviorSubject<IPost[]> = new BehaviorSubject(this.posts);

  getPosts() {
    return this.postSubject.asObservable();
  }

  addPost(postData: IPost) {
    this.posts.push(postData);
    this.postSubject.next(this.posts);
  }
}
