import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap, map, Observable, of, catchError, throwError, take, exhaustMap } from 'rxjs';
import { Employee } from '../employee/employee.model';
import { AuthService } from '../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  
  private _refreshrequired = new Subject<void>();
  employeesChanged = new Subject<Employee[]>();
  editUserId: any;
  get Refreshrequired() {
    return this._refreshrequired;
  }
  uniquesKey:any;
  emp: any[];

  constructor(private http: HttpClient,
    private authService: AuthService) { }
  private apiUrl = 'https://crud-6764c-default-rtdb.firebaseio.com/crud.json';
  employees: Employee[] = []; 
  saveEmployees(employees: any): Observable<Employee>{
    console.log("emplye result ",employees)
    return this.http.post<Employee>('https://crud-6764c-default-rtdb.firebaseio.com/crud.json', employees)
      .pipe(
        tap(() => {
          console.log('Save Successfully');
          this._refreshrequired.next();
        }),
        catchError((error) => {
          console.error('Error Saving data: ', error);
          throw error;
        })
      );
  }


getEmployees(){
    return this.http.get<Employee[]>('https://crud-6764c-default-rtdb.firebaseio.com/crud.json').pipe(
      map(resData => {
        console.log(resData);
        const userArray = [];
        for(const key in resData){
          // console.log(key);
          // console.log(resData[key]);
          if(resData.hasOwnProperty(key)){
            userArray.push({userId:key, ...resData[key]})
          }
        }
        return userArray;
      })
    )

  }

  getEmployeebyId(userId){
    return this.http.get('https://crud-6764c-default-rtdb.firebaseio.com/crud/'+userId+'.json');
  }

  deleteEmployee(userId){
    return this.http.delete<any>('https://crud-6764c-default-rtdb.firebaseio.com/crud/'+userId+'.json').pipe(tap(() => {
      this._refreshrequired.next;
    }))
  }
  updateEmployee(userId, updateEmployee: Employee) {
  this.editUserId = userId;
  console.log('https://crud-6764c-default-rtdb.firebaseio.com/crud/'+this.editUserId+'.json');
  return this.http.put<any>('https://crud-6764c-default-rtdb.firebaseio.com/crud/'+this.editUserId+'.json', updateEmployee);
  }
getEditUserId(): any {
    return this.editUserId;
  }


}