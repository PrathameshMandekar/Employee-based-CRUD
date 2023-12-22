import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { EmpDetailComponent } from './employee/emp-detail/emp-detail.component';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { ErrorComponent } from './error/error.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path:'login', component: AuthComponent },
  { path: 'employee', component: EmployeeComponent, children: [
      { path: 'emp-detail', component: EmpDetailComponent },
  ], canActivate: [AuthGuard] },
  { path: 'error', component: ErrorComponent },
  


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
