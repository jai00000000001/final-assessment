import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  error = '';

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.error = '';
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading employees: ' + error.message;
        this.loading = false;
      }
    });
  }

  editEmployee(id: number): void {
    this.router.navigate(['/employees/edit', id]);
  }

  deleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => {
          this.loadEmployees();
        },
        error: (error) => {
          this.error = 'Error deleting employee: ' + error.message;
        }
      });
    }
  }

  addEmployee(): void {
    this.router.navigate(['/employees/add']);
  }

  getAverageSalary(): number {
    if (this.employees.length === 0) return 0;
    const total = this.employees.reduce((sum, emp) => sum + emp.salary, 0);
    return total / this.employees.length;
  }

  getHighestSalary(): number {
    if (this.employees.length === 0) return 0;
    return Math.max(...this.employees.map(emp => emp.salary));
  }

  getLowestSalary(): number {
    if (this.employees.length === 0) return 0;
    return Math.min(...this.employees.map(emp => emp.salary));
  }
}
