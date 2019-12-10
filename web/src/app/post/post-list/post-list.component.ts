import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

import { PostService } from '../../services/post.service';
import { IPostResponse } from '../../models/IPostResponse';
import { AuthService } from '../../services/auth.service';
import { IPostSearchRequest } from 'src/app/models/IPostSearchRequest';

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

  curUser = this.authService.user;

  // pagination
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [1, 5, 10];

  search: IPostSearchRequest;

  ngOnInit() {
    this.postService.GetPosts(this.pageIndex, this.pageSize, this.search);
    this.subscription = this.postService.getPosts().subscribe(x => this.pageData = x);
  }

  delete(id: string) {
    if (this.pageIndex > 0 && this.pageIndex == this.pageData.totalPosts - 1 && this.pageData.posts.length == 1) {
      this.pageIndex -=1 ;
    }
    this.postService.DeletePost(id, this.pageIndex, this.pageSize);
  }

  download(postId: string, data?: any) {
    this.postService.DownloadPostDocument(postId, data);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    console.log(event);
    this.postService.GetPosts(this.pageIndex, this.pageSize, this.search);
  }

  onSearch(searchData: IPostSearchRequest) {
    console.log(searchData);
    this.search = searchData;
    this.postService.GetPosts(this.pageIndex, this.pageSize, this.search)
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }
}
