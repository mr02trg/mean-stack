import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forEach } from 'lodash';

import { PostService } from '../services/post.service';
import { IPost } from '../models/IPost';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private postService: PostService
  ) { }

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    content: ['', [Validators.required, Validators.maxLength(1000)]]
  });

  ngOnInit() {
  }

  addPost() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }
    const data: IPost = this.form.value;
    this.postService.addPost(data);
    this.form.reset();
    this.form.markAsUntouched();
    this.form.markAsPristine();
  }
}
