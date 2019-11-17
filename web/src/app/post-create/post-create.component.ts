import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach } from 'lodash';

import { PostService } from '../services/post.service';
import { IPost } from '../models/IPost';
import { ActivatedRoute } from '@angular/router';

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
    content: ['', [Validators.required, Validators.maxLength(1000)]]
  });

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
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

  private addPost() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }
    const data: IPost = this.form.value;
    this.postService.AddPost(data);
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }

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
    this.form.patchValue({
      title: data.title,
      content: data.content
    });
    this.form.updateValueAndValidity();
  }
}
