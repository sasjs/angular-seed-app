import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing'

import { RequestsModalComponent } from './requests-modal.component'

describe('RequestsModalComponent', () => {
  let component: RequestsModalComponent
  let fixture: ComponentFixture<RequestsModalComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RequestsModalComponent]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestsModalComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
