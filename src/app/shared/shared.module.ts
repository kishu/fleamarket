import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentPipe } from './pipes/moment.pipe';
import { FsTimestampPipe } from './pipes/fs-timestamp.pipe';

@NgModule({
  declarations: [MomentPipe, FsTimestampPipe],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [
    FsTimestampPipe,
    MomentPipe
  ]
})
export class SharedModule { }
