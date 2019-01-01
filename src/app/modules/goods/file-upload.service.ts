import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private uploadURL = environment.cloudinary.uploadURL;
  private preset = environment.cloudinary.preset;

  constructor(private http: HttpClient) { }

  upload(files: File[]) {
    const status = {};

    const headers = new HttpHeaders({
      'X-Requested-With': 'XMLHttpRequest'
    });

    const options = {
      headers,
      reportProgress: true
    };

    files.forEach(file => {
      const fd = new FormData();
      fd.set('upload_preset', this.preset);
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
