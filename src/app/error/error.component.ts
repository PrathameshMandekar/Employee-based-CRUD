
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  template: `
      <nav class="navbar navbar-dark bg-dark">
          <a class="navbar-brand">Employee CRUD</a>
          <!-- <a class="btn btn-outline-light" (click)="onLogout()" *ngIf="isAuthenticated">LogOut</a>
        <button class="btn btn-outline-primary" (click)="open(content)" routerLinkActive="active" -->

    
    </nav>
    <div>
      <h2>Please LogIn first to access the Data</h2>
      <p>{{ errorMessage }}</p>
      <button class="btn btn-primary" (click)="redirectToLogin()">Log In</button>
    </div>
  `,
  styles: [
    `
      div {
        text-align: center;
        margin-top: 50px;
      }

      button {
        margin-top: 20px;
      }
    `,
  ],
})
export class ErrorComponent implements OnInit {
  errorMessage: string;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.errorMessage = params['message'];
    });
  }

  redirectToLogin() {
    this.router.navigate(['/login']); // Adjust the login route accordingly
  }
}
