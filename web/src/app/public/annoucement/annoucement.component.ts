import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

import { IPostResponse } from 'src/app/models/posts/IPostResponse';

import { PostService } from 'src/app/services/post.service';
import { SnackbarService } from 'src/app/services/snackbar.service';


@Component({
  selector: 'app-annoucement',
  templateUrl: './annoucement.component.html',
  styleUrls: ['./annoucement.component.scss']
})
export class AnnoucementComponent implements OnInit {

  constructor(
    private postService: PostService,
    private snackBar: SnackbarService
  ) { }

  pageData: IPostResponse;

  // pagination
  pageIndex = 0;
  pageSize = 5;


  ngOnInit() {
    this.loadData(this.pageIndex, this.pageSize);
  }
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  private loadData(pageIndex: number, pageSize: number) {
    this.postService.GetAnnoucements(pageIndex, pageSize)
    .subscribe(success => {
      this.pageData = success;
    }, error => {
      this.snackBar.show('Failed to fetch announcements', 'Dismiss');
    })
  }
}
