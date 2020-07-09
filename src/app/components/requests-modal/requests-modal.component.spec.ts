import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestsModalComponent } from './requests-modal.component';

describe('RequestsModalComponent', () => {
  let component: RequestsModalComponent;
  let fixture: ComponentFixture<RequestsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
