import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: number,
    localId: string,
    registered?: boolean
}

@Injectable({providedIn: 'root'})

export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    isAuthenticated = false; 
    constructor(private http: HttpClient, private router: Router, private toastr: ToastrService){}

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YAIzaSyDpIg1TXTqs7VCUwTR0Cj9eC-fktvmAlHM',
        {
            email: email,
            password: password,
            returnSecureToken: true
        }
        ).pipe(
        catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
        );
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDpIg1TXTqs7VCUwTR0Cj9eC-fktvmAlHM',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
        tap(resData => {
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        })
        );
    }

autoLogin(expirationDuration: number): void {
    const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
        return;
    }

    const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
    );

    if (loadedUser.token) {
        this.user.next(loadedUser);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration); // Pass the arguments to autoLogout
    }
}


    logout(){
        this.user.next(null);
        this.isAuthenticated = false;
        this.router.navigate(['login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration: number){
        console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(()=> {
            this.logout();
            }, expirationDuration);
    }

    // Inside AuthService class
redirectToError() {
  this.router.navigate(['/error']);
  return false; // Returning false to indicate that navigation should be canceled
}

    private handleError(errorRes: HttpErrorResponse): Observable<never>{
        let errorMessage = 'An unknown error occured';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
            console.log(errorMessage);
        switch(errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = "THis email exists already";
            break;
            case "EMAIL_NOT_FOUND":
                errorMessage = "This Email does not exist";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "THis password is incorrect";
                break;
        }
        this.toastr.error(errorMessage, "Error");
        return throwError(errorMessage);
    }

    private handleAuthentication(
        email:string,
        userId: string,
        token: string,
        expiresIn: number
    ) {
        const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
        email, 
        userId,
        token,
        expirationDate
        );
        this.user.next(user);
        this.isAuthenticated = true;
        this.autoLogin(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }
}