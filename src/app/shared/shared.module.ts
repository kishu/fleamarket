import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsTimestampPipe, DistanceInWordsToNowPipe } from '@app/shared/pipes';

@NgModule({
  declarations: [DistanceInWordsToNowPipe, FsTimestampPipe],
  imports: [
    CommonModule
  ],
  exports: [
    FsTimestampPipe,
    DistanceInWordsToNowPipe
  ]
})
export class SharedModule { }
