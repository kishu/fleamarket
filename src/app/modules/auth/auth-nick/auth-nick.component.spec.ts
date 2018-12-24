import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthNickComponent } from './auth-nick.component';

describe('AuthNickComponent', () => {
  let component: AuthNickComponent;
  let fixture: ComponentFixture<AuthNickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthNickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthNickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
