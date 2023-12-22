import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeComponent } from './employee/employee.component';
import { EmpDetailComponent } from './employee/emp-detail/emp-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AlertComponent } from './service/alert/alert.component';
import { LoadingSpinnerComponent } from './service/loading-spinner/loading-spinner';
import { EmployeeService } from './service/employee.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorComponent } from './error/error.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeComponent,
    EmpDetailComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    ErrorComponent,
    
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [EmployeeService, {provide:HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
