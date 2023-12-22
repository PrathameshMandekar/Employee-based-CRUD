import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
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
  
  get Refreshrequired() {
    return this._refreshrequired;
  }

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
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        return this.http.get<Employee[]>(
          'https://crud-6764c-default-rtdb.firebaseio.com/crud.json', 
          {
            params: new HttpParams().set('auth', user.token)
          }
        );

      }),
    ).pipe(
      map(resData => {
        console.log(resData);
        const userArray = [];
        for(const key in resData){
          // console.log(key);
          // console.log(resData[key]);
          if(resData.hasOwnProperty(key)){
            userArray.push({userId:key, ...resData[key]})
          }
          // userArray.push({userId: key, ...resData[key]})
        }
        return userArray;
      })
    )
    // return this.http.get<Employee[]>('https://crud-6764c-default-rtdb.firebaseio.com/crud.json', 
    // {
    //   params: new HttpParams().set('auth', user.token)
    // }).pipe(
    //   map(resData => {
    //     console.log(resData);
    //     const userArray = [];
    //     for(const key in resData){
    //       // console.log(key);
    //       // console.log(resData[key]);
    //       if(resData.hasOwnProperty(key)){
    //         userArray.push({userId:key, ...resData[key]})
    //       }
    //       // userArray.push({userId: key, ...resData[key]})
    //     }
    //     return userArray;
    //   })
    // )

  }

  addEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>('https://crud-6764c-default-rtdb.firebaseio.com/crud.json', employee);
  }

  deleteEmployee(userId){
    return this.http.delete<any>('https://crud-6764c-default-rtdb.firebaseio.com/crud/'+userId+'.json').pipe(tap(() => {
      this._refreshrequired.next;
    }))
  }



}