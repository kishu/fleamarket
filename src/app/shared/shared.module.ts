import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FsTimestampPipe, DistanceInWordsToNowPipe, SanitizerPipe, ObjectURLPipe } from '@app/shared/pipes';
import { ThumbnailComponent } from './components/thumbnail/thumbnail.component';
import { SpinnerComponent } from './components/spinner/spinner.component';

@NgModule({
  declarations: [
    DistanceInWordsToNowPipe,
    FsTimestampPipe,
    SpinnerComponent,
    ThumbnailComponent,
    SanitizerPipe,
    ObjectURLPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FsTimestampPipe,
    DistanceInWordsToNowPipe,
    ObjectURLPipe,
    SanitizerPipe,
    SpinnerComponent,
    ThumbnailComponent
  ]
})
export class SharedModule { }
