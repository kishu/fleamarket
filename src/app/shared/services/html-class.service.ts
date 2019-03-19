import { Injectable, Renderer2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlClassService {
  constructor() { }

  set(className: string) {
    const htmlRef = document.getElementsByTagName('html')[0];
    htmlRef.className = className;
  }
}
