import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { QuillModule } from 'ngx-quill'

import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { PendingChangesGuard } from '../guards/pending-changes.guard';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostSearchComponent } from './post-search/post-search.component';

const routes: Routes = [
  { path: 'post', component: PostListComponent, canActivate: [AuthGuard] },
  { path: 'post/create', component: PostCreateComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
  { path: 'post/edit/:id', component: PostCreateComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
]

@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent,
    PostSearchComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    RouterModule.forRoot(routes),

    SharedModule,

    // global configuration for quill rich text editor
    QuillModule.forRoot({
      modules: {
        syntax: true,
        toolbar: [
          [{ header: [2, 3, 4, false] }],
          [  { size: [ 'small', false, 'large', 'huge' ] }],
          [{ 'color': [] }, { 'background': [] }],        
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'align': [] }],
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],  
          ['image', 'link', 'code-block'],
        ],
      }
    })
  ],
  exports: [
    PostListComponent,
    PostCreateComponent,
    PostSearchComponent
  ]
})
export class PostModule { }
