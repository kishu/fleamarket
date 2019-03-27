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

  toggle(className: string) {
    const htmlRef = document.getElementsByTagName('html')[0];
    const wrapRef = document.getElementsByClassName('wrap')[0] as HTMLElement;
    let _scrollTop = -(wrapRef.getBoundingClientRect().top);

    if (!htmlRef.classList.contains(className)) {
      wrapRef.style.top = -(window.scrollY) + 'px';
      htmlRef.classList.add(className);
    } else {
      htmlRef.classList.remove(className);
      window.scrollTo(0, _scrollTop);
    }
  }
}
