export class ImageFile {
  private readonly _file: File;
  private _url: ArrayBuffer;

  get file() { return this._file; }
  get url() { return this._url; }

  constructor(source: File) {
    this._file = source as File;
  }

  readAsDataURL() {
    return new Promise(resolve => {
      const reader = new FileReader();

      reader.addEventListener('load', () => {
        this._url = reader.result as ArrayBuffer;
        resolve();
      }, false);

      reader.readAsDataURL(this.file);
    });
  }

}
