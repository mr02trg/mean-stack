import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { IPost } from '../models/IPost';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  constructor(
    private postService: PostService
  ) { }

  posts: IPost[] = [];
  subscription: Subscription;

  ngOnInit() {
    this.postService.GetPosts();
    this.subscription = this.postService.getPosts().subscribe(x => this.posts = x);
  }
}
