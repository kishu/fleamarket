import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss']
})
export class ThumbnailComponent implements OnInit {
  @Input() file: File;
  @Output() loaded = new EventEmitter<Blob>();
  @ViewChild('divRef') divRef: ElementRef;

  constructor() { }

  ngOnInit() {
    const divEl = this.divRef.nativeElement as HTMLDivElement;
    const image = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    image.src = URL.createObjectURL(this.file);
    image.onload = () => {
      const { width, height } = image;
      const ratio = width / height;
      const resizeWidth = Math.min(width, 720);
      const resizeHeight = resizeWidth / ratio;
      canvas.width = resizeWidth;
      canvas.height = resizeHeight;
      ctx.drawImage(image, 0, 0, resizeWidth, resizeHeight);
      canvas.toBlob(b => {
        divEl.style.backgroundImage = `URL(${URL.createObjectURL(b)})`;
        this.loaded.emit(b);
      });
    };
  }

}
