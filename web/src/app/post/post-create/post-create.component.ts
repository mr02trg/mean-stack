import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach, remove } from 'lodash';
import { ActivatedRoute } from '@angular/router';

import { PostService } from '../../services/post.service';
import { IPost } from '../../models/posts/IPost';
import { IDocument } from '../../models/posts/IDocument';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private route: ActivatedRoute
  ) { }

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.maxLength(1000)]],
    tags: [[]],
    documents: [null]
  });

  files: (File|IDocument)[] = [];
  postId: string;

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
    this.postService.GetPostById(postId)
        .subscribe(res => {
          if (res) {
            this.setForm(res);
          }
        }, error => {
          console.error('Failed to fetch post');
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
