import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalToggleService {

  notification$ = new Subject<boolean>();

  constructor() { }
}
