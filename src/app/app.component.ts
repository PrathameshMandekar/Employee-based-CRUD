import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  constructor(private authService: AuthService){}

  ngOnInit(): void {
    const expirationDuration = 3600000; // Replace with your actual value in milliseconds

    this.authService.autoLogin(expirationDuration);
  }
}
