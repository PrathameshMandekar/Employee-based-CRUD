import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee } from '../employee.model';
import { EmployeeService } from 'src/app/service/employee.service';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-emp-detail',
  templateUrl: './emp-detail.component.html',
  styleUrls: ['./emp-detail.component.scss']
})
export class EmpDetailComponent {
  @Input() employee: Employee = {} as Employee;
  @Output() onDeleteEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private service: EmployeeService) {}

  onDelete(userId) {
    if (confirm('Do you want to delete?')) {
      console.log(userId);
      this.service.deleteEmployee(userId).subscribe(() => {
        this.onDeleteEvent.emit();
      });
    }
  }
}
