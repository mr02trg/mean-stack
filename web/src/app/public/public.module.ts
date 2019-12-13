import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ReactiveFormsModule } from '@angular/forms';
import { MaterialDesignModule } from '../material-design/material-design.module';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ActivateComponent } from './activate/activate.component';
import { AnnoucementComponent } from './annoucement/annoucement.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'activate/:token', component: ActivateComponent },
  { path: 'annoucement', component: AnnoucementComponent },
];

@NgModule({
  declarations: [
    RegisterComponent, 
    LoginComponent, 
    ActivateComponent, 
    AnnoucementComponent, 
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),
    MaterialDesignModule
  ],
  exports: [
    RegisterComponent,
    LoginComponent,
    AnnoucementComponent
  ]
})
export class PublicModule { }
