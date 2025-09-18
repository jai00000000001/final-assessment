import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.css']
})
export class EmployeeFormComponent implements OnInit {
  employee: Employee = {
    id: 0,
    name: '',
    address: '',
    salary: 0
  };
  isEdit = false;
  loading = false;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loadEmployee(+id);
    }
  }

  loadEmployee(id: number): void {
    this.loading = true;
    this.error = '';
    this.employeeService.getEmployee(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading employee: ' + error.message;
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.isEdit) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  createEmployee(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.createEmployee(this.employee).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.error = 'Error creating employee: ' + error.message;
        this.loading = false;
      }
    });
  }

  updateEmployee(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.updateEmployee(this.employee.id, this.employee).subscribe({
      next: () => {
        this.router.navigate(['/employees']);
      },
      error: (error) => {
        this.error = 'Error updating employee: ' + error.message;
        this.loading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/employees']);
  }
}
