import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private displayName: string;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.loginUserInfo.subscribe(user => {
      this.displayName = user.displayName;
    });
  }

}
