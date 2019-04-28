import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class ImageFileResizeService {

  constructor(
    @Inject(DOCUMENT) private document: Document
  ) { }

  resizeImageFileList(files: Map<string, File>): Promise<File[]> {
    const promises = [];
    files.forEach(file => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      promises.push(
        new Promise((resolve) => {
          image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const { width, height } = image;
            let resizeWidth;
            let resizeHeight;
            if (width >= height) {
              resizeWidth = Math.min(width, 720);
              resizeHeight = resizeWidth / (width / height);
            } else {
              resizeHeight = Math.min(height, 720);
              resizeWidth = resizeHeight / (height / width);
            }
            canvas.width = resizeWidth;
            canvas.height = resizeHeight;
            ctx.drawImage(image, 0, 0, resizeWidth, resizeHeight);
            canvas.toBlob(b => {
              resolve(new File([b], file.name, {
                type: file.type,
                lastModified: file.lastModified
              }));
            });
          };
        })
      );
    });
    return Promise.all(promises);
  }
}
