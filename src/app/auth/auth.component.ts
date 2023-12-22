import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from '@angular/router';
import { AuthResponseData, AuthService } from "./auth.service";
import { LoadingSpinnerComponent } from "../service/loading-spinner/loading-spinner";
import { Observable, Subscription } from "rxjs";
import { ToastrModule, ToastrService } from "ngx-toastr";


@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit{
    isLoginMode = true;
    isLoading = false;
    error: string = "";
    isAuthenticated = false;
      private userSub!: Subscription;
    constructor(private authService: AuthService, private router: Router, private toastr: ToastrService){}

    ngOnInit(): void {
              this.userSub = this.authService.user.subscribe(user => {
        this.isAuthenticated = !!user;
        console.log(!user);
        console.log(!!user);
        
      });
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm){
        if (!form.valid){
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        let authObs: Observable<AuthResponseData> | null = null;

        this.isLoading = true;
        if (this.isLoginMode){
            authObs = this.authService.login(email, password);
        } else {
            authObs = this.authService.signup(email, password);
        }

        authObs.subscribe(
            resData => {
                console.log(resData);
                this.isLoading = false;
                this.router.navigate(['./employee']);
                this.toastr.success(
                    'Login Succesful',
                    'Success'
                  );
            },
            errorMessage => {
                console.log(errorMessage);
                this.error = errorMessage;
                this.isLoading = false;
                this.toastr.error(
                    'Invalid login',
                    'Error'
                  );
            }
        );
        form.reset();
    }

    
}