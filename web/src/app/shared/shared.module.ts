import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { MaterialDesignModule } from '../material-design/material-design.module';



@NgModule({
  declarations: [
    TagComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule
  ],
  exports: [
    TagComponent
  ]
})
export class SharedModule { }
