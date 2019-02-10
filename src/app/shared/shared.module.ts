import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsTimestampPipe, MomentPipe } from '@app/shared/pipes';

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
