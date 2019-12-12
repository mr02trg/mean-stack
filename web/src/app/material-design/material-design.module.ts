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
   MAT_SNACK_BAR_DEFAULT_OPTIONS,
   MatProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,


  ],
  providers: [
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
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
