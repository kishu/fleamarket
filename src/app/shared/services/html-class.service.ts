import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HtmlClassService {
  private htmlRef: HTMLElement;
  private fixed = ['no-scroll'];

  constructor() {
    this.htmlRef = document.getElementsByTagName('html')[0] as HTMLElement;
  }

  set(className: string) {
    const classList = [className];
    this.fixed.forEach(f => {
      if (this.htmlRef.classList.contains(f)) {
        classList.push(f);
      }
    });
    this.htmlRef.className = classList.join(' ');
  }

  addClassName(className: string) {
    this.htmlRef.classList.add(className);
  }

  removeClassName(className: string) {
    this.htmlRef.classList.remove(className);
  }

  enableScroll() {
    const wrapRef = document.getElementsByClassName('wrap')[0] as HTMLElement;
    this.removeClassName('no-scroll');
    wrapRef.style.top = -(window.scrollY) + 'px';

  }

  disableScroll() {
    const wrapRef = document.getElementsByClassName('wrap')[0] as HTMLElement;
    const scrollTop = -(wrapRef.getBoundingClientRect().top);
    this.addClassName('no-scroll');
    window.scrollTo(0, scrollTop);
  }

}
