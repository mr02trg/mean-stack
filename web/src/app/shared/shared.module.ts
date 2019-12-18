import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    TagComponent,
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    NgxSpinnerModule
  ],
  exports: [
    TagComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
