import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SharedModule } from '../shared/shared.module';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';

import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';

const routes: Routes = [
  { path: 'post', component: PostListComponent },
  { path: 'post/create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/edit/:id', component: PostCreateComponent, canActivate: [AuthGuard] },
]

@NgModule({
  declarations: [
    PostListComponent,
    PostCreateComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    RouterModule.forRoot(routes),

    SharedModule,
  ],
  exports: [
    PostListComponent,
    PostCreateComponent
  ]
})
export class PostModule { }
