import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';

import { IPostResponse } from 'src/app/models/posts/IPostResponse';

import { PostService } from 'src/app/services/post.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-annoucement',
  templateUrl: './annoucement.component.html',
  styleUrls: ['./annoucement.component.scss']
})
export class AnnoucementComponent implements OnInit {

  constructor(
    private postService: PostService,
    private snackBar: SnackbarService,
    private spinner: SpinnerService
  ) { }

  pageData: IPostResponse;

  // pagination
  pageIndex = 0;
  pageSize = 1;


  ngOnInit() {
    this.loadData(this.pageIndex, this.pageSize);
  }
  
  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData(this.pageIndex, this.pageSize);
  }

  private loadData(pageIndex: number, pageSize: number) {
    this.spinner.show();
    this.postService.GetAnnoucements(pageIndex, pageSize)
    .subscribe(success => {
      this.pageData = success;
      this.spinner.hide();
    }, error => {
      this.snackBar.show('Failed to fetch announcements', 'Dismiss');
      this.spinner.hide();
    })
  }
}
