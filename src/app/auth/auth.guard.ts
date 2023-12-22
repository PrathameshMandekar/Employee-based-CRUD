import { Injectable, inject } from "@angular/core";
import { CanActivateFn, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: "root"

})

class isAuthGuard {
    
    constructor(private authService: AuthService){}
    
    canActivate(
        route: ActivatedRouteSnapshot, 
        state: RouterStateSnapshot
        ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
            return this.authService.user.pipe(map(user => {
                        const isAuthenticated = !!user;
        if (!isAuthenticated) {
          // Redirect to the error route if not authenticated
          return this.authService.redirectToError();
        }
        return true;
            }));
    }
}
    export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
        return inject(isAuthGuard).canActivate(route, state);
    }
