import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreferenceNotificationComponent } from './preference-notification.component';

describe('PreferenceNotificationComponent', () => {
  let component: PreferenceNotificationComponent;
  let fixture: ComponentFixture<PreferenceNotificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreferenceNotificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreferenceNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
