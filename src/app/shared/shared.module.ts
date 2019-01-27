import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelativeDatePipe } from './pipes/relative-date.pipe';
import { FsTimestampPipe } from './pipes/fs-timestamp.pipe';

@NgModule({
  declarations: [RelativeDatePipe, FsTimestampPipe],
  imports: [
    CommonModule
  ],
  providers: []
})
export class SharedModule { }
