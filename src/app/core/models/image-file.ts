// import * as EXIF from 'exif-js';

export class ImageFile {
  private readonly _file: File;
  private _url: ArrayBuffer;

  get file() { return this._file; }
  get url() { return this._url; }

  constructor(source: File) {
    this._file = source as File;
  }

  public readAsDataURL() {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('load', async () => {
        // const orientation = await this.getImageOrientation(this.file);
        // const refineImageUrl = await this.refineImage(reader.result, orientation);
        // this._url = refineImageUrl;
        this._url = reader.result as ArrayBuffer;
        resolve();
      }, false);

      reader.readAsDataURL(this.file);
    });
  }

  // private getImageOrientation(file) {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       EXIF.getData(file, () => {
  //         const orientation = EXIF.getTag(file, 'Orientation') || 0;
  //         resolve(orientation);
  //       });
  //     } catch (e) {
  //       reject(e);
  //     }
  //   });
  // }

  // private refineImage(dataUrl, srcOrientation): Promise<string> {
  //   return new Promise(async (resolve) => {
  //     const img = new Image();
  //
  //     img.onload = function() {
  //       const width = img.width;
  //       const height = img.height;
  //       const canvas = document.createElement('canvas');
  //       const ctx = canvas.getContext('2d');
  //
  //       if (4 < srcOrientation && srcOrientation < 9) {
  //         canvas.width = height;
  //         canvas.height = width;
  //       } else {
  //         canvas.width = width;
  //         canvas.height = height;
  //       }
  //
  //       switch (srcOrientation) {
  //         case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
  //         case 3: ctx.transform(-1, 0, 0, -1, width, height ); break;
  //         case 4: ctx.transform(1, 0, 0, -1, 0, height ); break;
  //         case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
  //         case 6: ctx.transform(0, 1, -1, 0, height , 0); break;
  //         case 7: ctx.transform(0, -1, -1, 0, height , width); break;
  //         case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
  //         default: break;
  //       }
  //
  //       ctx.drawImage(img, 0, 0);
  //       resolve(canvas.toDataURL());
  //     };
  //
  //     img.src = dataUrl;
  //   });
  // }
}
