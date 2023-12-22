import { Component, ElementRef, inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgForm } from '@angular/forms';
import { Employee } from './employee.model';
import { ModalDismissReasons, NgbDatepickerModule, NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { EmployeeService } from '../service/employee.service';
import { EmpDetailComponent } from './emp-detail/emp-detail.component';
import { AuthResponseData, AuthService } from '../auth/auth.service';
import { Observable, Subscription } from 'rxjs';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss'],
})
export class EmployeeComponent implements OnInit, OnDestroy {
  @ViewChild('content') addView!: ElementRef;
  emp: any[];
  editdata: any;
  searchId: any = '';
  editMode: boolean = false;
  // editUserId;
  searchResultsCount: number = 0;
  userId: any;
  editUserId: any;
  constructor(
    private modalService: NgbModal,
    private service: EmployeeService,
    private formBuilder: FormBuilder,
    private offCanvas: NgbOffcanvas,
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}
  closeResult = '';
  employee: Employee[] = [];

  private userSub!: Subscription;
  isAuthenticated = false;

  empform = new FormGroup<any>({
    id: new FormControl({
      validators: [Validators.required, Validators.pattern(/^\S*$/)],
    }),
    name: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.minLength(5)])
    ),
    // dateOfBirth: new FormControl(),
    email: new FormControl('', Validators.compose([Validators.required])),
    phone: new FormControl('', Validators.compose([Validators.required])),
    designation: new FormControl('', Validators.compose([Validators.required])),
    yearsofexp: new FormControl('', Validators.compose([Validators.required])),
    manager: new FormControl('', Validators.compose([Validators.required])),
    skills: new FormControl('', Validators.compose([Validators.required])),
  });

  ngOnInit(): void {
    this.fetchEmployees();
    this.subscribeToEmployeeChanges();
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onSave(userId) {
    console.log(this.empform.value);
    if (this.empform.valid) {
      const enteredId = this.empform.get('id').value;
      const idExists = this.employee.some((emp) => emp.id === enteredId);
      if (this.editMode) {
        const editUserId = this.service.getEditUserId();
        console.log(this.editUserId);
        console.log(
          this.service.updateEmployee(this.editUserId, this.empform.value)
        );
        this.service
          .updateEmployee(this.editUserId, this.empform.value)
          .subscribe((res) => {
            console.log(res);
            this.fetchEmployees();
            this.editMode = false;
            this.toastr.success(
              'Updated successfully!',
              'Success'
            );
          });
      } else {
        if (idExists) {
          this.toastr.error(
            'ID already exists. Please choose a different ID.',
            'Error'
          );
          // this.empform.reset();
        } else {
          this.service.saveEmployees(this.empform.value).subscribe(
            (response) => {
              console.log('Save Successfully: ', response);
              this.empform.reset();
              this.fetchEmployees();
              this.toastr.success(
                'Employee data saved successfully!',
                'Success'
              );
            },
            (error) => {
              console.error('Error saving data: ', error);
            }
          );
        }
      }
    }
  }

  fetchEmployees() {
    this.service.getEmployees().subscribe((emp) => {
      console.log(this.employee);
      this.employee = emp;
    });
  }
  searchEmployee() {
    if (this.searchId.trim() !== '') {
      this.employee = this.employee.filter((emp) =>
        this.matchesSearchCriteria(emp, this.searchId)
      );
      this.searchResultsCount = this.employee.length;
    } else {
      this.fetchEmployees();
      this.searchResultsCount = 0;
    }
  }

  matchesSearchCriteria(employee: Employee, searchTerm: string): boolean {
    searchTerm = searchTerm.toLowerCase();

    return (
      employee.id.toString().toLowerCase().includes(searchTerm) ||
      employee.name.toLowerCase().includes(searchTerm) ||
      employee.email.toLowerCase().includes(searchTerm) ||
      employee.phone.toLowerCase().includes(searchTerm) ||
      employee.designation.toLowerCase().includes(searchTerm) ||
      employee.skills.toLowerCase().includes(searchTerm) ||
      employee.yearsofexp.toString().toLowerCase().includes(searchTerm) ||
      employee.manager.toLowerCase().includes(searchTerm)
    );
  }

  fetchAllEmployees() {
    this.fetchEmployees();
  }
  isViewButtonVisible = false;
  hoveredRowIndex: number | null = null;

  showViewButton(index: number) {
    this.isViewButtonVisible = true;
    this.hoveredRowIndex = index;
  }

  hideViewButton() {
    this.isViewButtonVisible = false;
    this.hoveredRowIndex = null;
  }

  onView(emp: Employee) {
    const modalRef = this.offCanvas.open(EmpDetailComponent, {
      position: 'end',
      scroll: true,
    });
    modalRef.componentInstance.employee = emp;
    modalRef.componentInstance.onDeleteEvent.subscribe(() => {
      this.fetchEmployees(); // Refresh the employee list
      modalRef.dismiss();
    });
    // modalRef.componentInstance.onUpdateEvent.subscribe(() => {
    // });
  }

  onDelete(userId) {
    if (confirm('Do you want to delete?')) {
      console.log(userId);
      this.service.deleteEmployee(userId).subscribe(() => {
        this.fetchEmployees();
      });
    }
  }

  onEdit(userId, index) {
    this.editMode = true;
    this.loadEditData(userId, index);
    console.log('userId => ', userId, index);
    this.editUserId = userId;
    console.log(this.editUserId);
  }

  loadEditData(userId, index) {
    this.open();
    this.service.getEmployeebyId(userId).subscribe((res) => {
      this.editdata = res;
      this.empform.setValue({
        id: this.editdata.id,
        name: this.editdata.name,
        email: this.editdata.email,
        phone: this.editdata.phone,
        designation: this.editdata.designation,
        yearsofexp: this.editdata.yearsofexp,
        manager: this.editdata.manager,
        skills: this.editdata.skills,
      });
    });
  }

  clearForm() {
    this.empform.setValue({
      id: '',
      name: '',
      email: '',
      phone: '',
      designation: '',
      yearsofexp: '',
      manager: '',
      skills: '',
    });
  }

  private subscribeToEmployeeChanges() {
    this.service.Refreshrequired.subscribe(() => {
      this.fetchEmployees();
    });
  }

  open() {
    this.clearForm();
    // this.editMode = false;
    this.modalService
      .open(this.addView, { ariaLabelledBy: 'modal-basic-title',backdrop: 'static', })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.editMode = false;
        }
      );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  isLoginMode = true;
  isLoading = false;
  error: string = '';

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData> | null = null;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['./employee']);
      },
      (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        // this.isLoading = false;
      }
    );
    form.reset();
  }

  onLogout() {
    this.authService.logout();
  }
}