import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private _show$ = new Subject<boolean>();
  get show$(): Observable<boolean> { return this._show$.asObservable(); }

  constructor() { }

  show(isShow) {
    this._show$.next(isShow);
  }

}
