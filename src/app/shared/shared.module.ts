import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MomentPipe } from '@app/shared/pipes/moment.pipe';
import { FsTimestampPipe } from '@app/shared/pipes/fs-timestamp.pipe';

@NgModule({
  declarations: [MomentPipe, FsTimestampPipe],
  imports: [
    CommonModule
  ],
  exports: [
    FsTimestampPipe,
    MomentPipe
  ]
})
export class SharedModule { }
