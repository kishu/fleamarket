import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelativeDatePipe } from './pipes/relative-date.pipe';

@NgModule({
  declarations: [RelativeDatePipe],
  imports: [
    CommonModule
  ],
  providers: []
})
export class SharedModule { }
