import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LogoutButtonComponent } from './logout-button.component';
import { LoginService } from 'src/app/core/services/login/login.service';

describe('LogoutButtonComponent', () => {
  let component: LogoutButtonComponent;
  let fixture: ComponentFixture<LogoutButtonComponent>;
  let router: jasmine.SpyObj<Router>;
  let loginService: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const loginServiceSpy = jasmine.createSpyObj('LoginService', ['logout']);

    await TestBed.configureTestingModule({
      declarations: [LogoutButtonComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: LoginService, useValue: loginServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LogoutButtonComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    loginService = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have logout button', () => {
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should call onLogout when button is clicked', () => {
    spyOn(component, 'onLogout');
    
    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(component.onLogout).toHaveBeenCalled();
  });

  it('should call loginService logout on logout', () => {
    component.onLogout();

    expect(loginService.logout).toHaveBeenCalled();
  });

  it('should navigate to home page on logout', () => {
    component.onLogout();

    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should emit logout event', () => {
    spyOn(component.logout, 'emit');
    
    component.onLogout();

    expect(component.logout.emit).toHaveBeenCalled();
  });
}); 