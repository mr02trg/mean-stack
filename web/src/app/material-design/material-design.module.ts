import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatDatepickerModule, SatNativeDateModule } from 'saturn-datepicker';
import
{ 
   MatToolbarModule,
   MatCardModule,
   MatFormFieldModule,
   MatInputModule,
   MatExpansionModule,
   MatButtonModule,
   MatDividerModule,
   MatPaginatorModule,
   MatListModule,
   MatIconModule,
   MatChipsModule,
   MatDatepickerModule,
   MatNativeDateModule, 
   MatSnackBarModule,
   MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatButtonModule,
    MatDividerModule,
    MatPaginatorModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    SatDatepickerModule, 
    SatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class MaterialDesignModule { }
