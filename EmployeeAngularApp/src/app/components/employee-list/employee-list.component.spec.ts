import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let fixture: ComponentFixture<EmployeeListComponent>;
  let employeeService: jasmine.SpyObj<EmployeeService>;

  const mockEmployees: Employee[] = [
    { id: 1, name: 'John Doe', address: '123 Main St', salary: 50000 },
    { id: 2, name: 'Jane Smith', address: '456 Oak Ave', salary: 60000 }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee']);

    await TestBed.configureTestingModule({
      declarations: [EmployeeListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: EmployeeService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
    employeeService = TestBed.inject(EmployeeService) as jasmine.SpyObj<EmployeeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load employees on init', () => {
    employeeService.getEmployees.and.returnValue(of(mockEmployees));

    component.ngOnInit();

    expect(employeeService.getEmployees).toHaveBeenCalled();
    expect(component.employees).toEqual(mockEmployees);
    expect(component.loading).toBeFalse();
    expect(component.error).toBe('');
  });

  it('should handle error when loading employees', () => {
    const errorMessage = 'Error loading employees';
    employeeService.getEmployees.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(component.error).toBe('Error loading employees: ' + errorMessage);
    expect(component.loading).toBeFalse();
  });

  it('should delete employee successfully', () => {
    employeeService.deleteEmployee.and.returnValue(of({}));
    employeeService.getEmployees.and.returnValue(of(mockEmployees));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteEmployee(1);

    expect(employeeService.deleteEmployee).toHaveBeenCalledWith(1);
    expect(employeeService.getEmployees).toHaveBeenCalledTimes(2); // Once in ngOnInit, once after delete
  });

  it('should not delete employee if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deleteEmployee(1);

    expect(employeeService.deleteEmployee).not.toHaveBeenCalled();
  });

  it('should handle error when deleting employee', () => {
    const errorMessage = 'Error deleting employee';
    employeeService.deleteEmployee.and.returnValue(throwError(() => new Error(errorMessage)));
    spyOn(window, 'confirm').and.returnValue(true);

    component.deleteEmployee(1);

    expect(component.error).toBe('Error deleting employee: ' + errorMessage);
  });
});

function throwError(errorFactory: () => any) {
  return new Promise((resolve, reject) => {
    reject(errorFactory());
  });
}
