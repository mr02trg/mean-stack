import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach, remove } from 'lodash';
import { ActivatedRoute } from '@angular/router';

import { IPost } from '../../models/posts/IPost';
import { IDocument } from '../../models/posts/IDocument';
import { RoleType } from 'src/app/models/enum/RoleType.enum';
import { IUser } from 'src/app/models/users/IUser';

import { AuthService } from 'src/app/services/auth.service';
import { PostService } from '../../services/post.service';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SpinnerService } from 'src/app/services/spinner.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: SnackbarService,
    private spinner: SpinnerService
  ) { 
    this.user = this.authService.user;
  }

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: [''],
    tags: [[]],
    documents: [null]
  });

  files: (File|IDocument)[] = [];
  postId: string;
  post: IPost;

  RoleType = RoleType;
  user: IUser;

  ngOnInit() {
    this.route.paramMap
        .subscribe(params => {
          this.postId = params.get('id');
          if (this.postId) {
            this.getPost(this.postId);
          }
        })
  }

  onDocumentSelect(event: Event) {
    const fileList = (event.target as HTMLInputElement).files;
    forEach(fileList, file => this.files.push(file));

    this.form.patchValue({
      'documents': this.files
    })
    this.form.updateValueAndValidity();
  }

  download(postId?: string, data?: any) {
    this.postService.DownloadPostDocument(postId, data);
    this.form.patchValue({
      'documents': this.files
    })
    this.form.updateValueAndValidity();
  }

  removeAttachment(data: any) {
    remove(this.files, x => x === data);
    this
  }

  submit() {
    if (this.postId) {
      this.updatePost();
    }
    else {
      this.addPost();
    }
  }

  togglePublish() {
    if (this.post.isPublic) {
      this.postService.UnPublishPost(this.postId)
          .subscribe(x => {
            this.post.isPublic = false;
            this.snackBar.show('Unpublish successfully');
          }, error => {
            this.snackBar.show('Failed to unpublish post. Please try again later');
          })
    }
    else {
      this.postService.PublishPost(this.postId)
          .subscribe(x => {
            this.post.isPublic = true;
            this.snackBar.show('Publish successfully');
          }, error => {
            this.snackBar.show('Failed to publish post. Please try again later');
          })
    }
  }

  private updatePost() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }

    const data = {
      ...this.form.value,
      _id: this.postId
    }

    this.postService.UpdatePost(this.postId, data);
  }

  private addPost() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }

    const data: IPost = this.form.value;
    this.postService.AddPost(data);
  }

  // load post by id
  private getPost(postId: string) {
    this.spinner.show();
    this.postService.GetPostById(postId)
        .subscribe(res => {
          if (res) {
            this.post = res;
            this.setForm(res);
          }
          this.spinner.hide();
        }, error => {
          console.error('Failed to fetch post');
          this.spinner.hide();
        })
  }

  private setForm(data: IPost) {
    this.files = data.documents;
    this.form.patchValue({
      title: data.title,
      content: data.content,
      tags: data.tags,
      documents: data.documents
    });
    this.form.updateValueAndValidity();
  }
}
