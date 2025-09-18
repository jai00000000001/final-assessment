import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all employees', () => {
    const mockEmployees: Employee[] = [
      { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 },
      { id: 2, name: 'Jane Smith', address: '456 Oak Ave', salary: 60000 }
    ];

    service.getEmployees().subscribe(employees => {
      expect(employees).toEqual(mockEmployees);
    });

    const req = httpMock.expectOne('http://localhost:5071/api/employee');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });

  it('should get employee by id', () => {
    const mockEmployee: Employee = { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 };

    service.getEmployee(1).subscribe(employee => {
      expect(employee).toEqual(mockEmployee);
    });

    const req = httpMock.expectOne('http://localhost:5071/api/employee/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployee);
  });

  it('should create employee', () => {
    const newEmployee: Employee = { id: 0, name: 'New Employee', address: 'New Address', salary: 70000 };
    const createdEmployee: Employee = { id: 3, name: 'New Employee', address: 'New Address', salary: 70000 };

    service.createEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(createdEmployee);
    });

    const req = httpMock.expectOne('http://localhost:5071/api/employee');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);
    req.flush(createdEmployee);
  });

  it('should update employee', () => {
    const updatedEmployee: Employee = { id: 1, name: 'Updated Employee', address: 'Updated Address', salary: 80000 };

    service.updateEmployee(1, updatedEmployee).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5071/api/employee/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedEmployee);
    req.flush({});
  });

  it('should delete employee', () => {
    service.deleteEmployee(1).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('http://localhost:5071/api/employee/1');
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
