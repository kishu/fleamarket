import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthMailComponent } from './auth-mail.component';

describe('authMailComponent', () => {
  let component: AuthMailComponent;
  let fixture: ComponentFixture<AuthMailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
