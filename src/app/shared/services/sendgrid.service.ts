import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendgridService {
  private endpoint = 'https://api.sendgrid.com/v3/mail/send';
  private apiKey = environment.sendgrid.apiKey;

  constructor(private http: HttpClient) { }

  sendLoginMail(toEmail: string, corpName: string, authCode: string) {
    const data = {
      personalizations: [{
        to: [{
          email: toEmail
        }],
        dynamic_template_data: {
          corpName,
          authCode
        }
      }],
      from: {
        email: 'auth@2ndmarket.co',
        name: '세컨드마켓'
      },
      template_id: 'd-5bd40ca17da84a4b95fa1248aaf72ce0'
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      })
    };

    return this.http.post(this.endpoint, data, httpOptions);
  }
}
