import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpRequest, HttpResponse} from '@angular/common/http';
import {Subject} from 'rxjs';
import {CloudinaryPreset} from '../../shared/models';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadURL = environment.cloudinary.uploadURL;

  constructor(private http: HttpClient) { }

  upload(files: File[], preset: CloudinaryPreset) {
    const status = {};
    let upload_preset;

    switch (preset) {
      case CloudinaryPreset.goods:
        upload_preset = environment.cloudinary.preset.goods;
        break;
      case CloudinaryPreset.profile:
        upload_preset = environment.cloudinary.preset.profile;
        break;
    }

    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    const options = {
      headers,
      reportProgress: true
    };

    files.forEach(file => {
      const fd = new FormData();
      fd.set('upload_preset', upload_preset);
      fd.set('file', file);

      const req = new HttpRequest(
        'POST',
        this.uploadURL,
        fd,
        options
      );

      const progress = new Subject<any>();
      const response = new Subject<HttpResponse<any>>();

      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round(100 * event.loaded / event.total);
          progress.next({
            filename: file.name,
            percent: percent
          });
        } else if (event instanceof HttpResponse) {
          response.next(event);
          response.complete();
          progress.complete();
        }
      });

      status[file.name] = {
        progress: progress.asObservable(),
        response: response.asObservable()
      };
    });

    return status;
  }
}
