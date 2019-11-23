import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostService } from '../services/post.service';
import { IPost } from '../models/IPost';
import { IPostResponse } from '../models/IPostResponse';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) { }

  pageData: IPostResponse;
  subscription: Subscription;

  // pagination
  pageIndex = 0;
  pageSize = 1;
  pageSizeOptions: number[] = [1, 5, 10];

  ngOnInit() {
    this.postService.GetPosts(this.pageIndex, this.pageSize);
    this.subscription = this.postService.getPosts().subscribe(x => this.pageData = x);
  }

  delete(id: string) {
    if (this.pageIndex > 0 && this.pageIndex == this.pageData.totalPosts - 1 && this.pageData.posts.length == 1) {
      this.pageIndex -=1 ;
    }
    this.postService.DeletePost(id, this.pageIndex, this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log(event);
    this.postService.GetPosts(this.pageIndex, this.pageSize);
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
