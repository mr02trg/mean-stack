import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagComponent } from './tag/tag.component';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { SpinnerComponent } from './spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';


@NgModule({
  declarations: [
    TagComponent,
    SpinnerComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    MaterialDesignModule,
    NgxSpinnerModule
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  exports: [
    TagComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
