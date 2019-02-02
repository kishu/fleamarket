import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private router: Router) { }

  goBack(list?: string) {
    if (window.history.length > 2) {
      window.history.back();
    } else {
      if (list && list === 'lounge') {
        this.router.navigate(['/lounge']);
      } else {
        this.router.navigate(['/']);
      }
    }
  }
}
