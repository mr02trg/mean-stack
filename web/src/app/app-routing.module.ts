import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostListComponent } from './post-list/post-list.component';
import { PostCreateComponent } from './post-create/post-create.component';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  { path: 'post', component: PostListComponent },
  { path: 'post/create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/edit/:id', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
