export class ImageFile {
  private readonly _file: File;
  private _dataURL: string | ArrayBuffer;

  get file() { return this._file; }
  get dataURL() { return this._dataURL; }

  constructor(file: File) {
    this._file = file;
  }

  readAsDataURL() {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this._dataURL = reader.result;
        resolve();
      }, false);

      reader.readAsDataURL(this.file);
    });
  }

}
