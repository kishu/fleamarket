import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsTimestampPipe, DistanceInWordsToNowPipe } from '@app/shared/pipes';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [DistanceInWordsToNowPipe, FsTimestampPipe, SpinnerComponent, ThumbnailComponent],
  imports: [
    CommonModule
  ],
  exports: [
    FsTimestampPipe,
    DistanceInWordsToNowPipe,
    SpinnerComponent,
    ThumbnailComponent
  ]
})
export class SharedModule { }
