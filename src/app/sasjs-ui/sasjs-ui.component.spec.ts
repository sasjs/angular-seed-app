import { ComponentFixture, TestBed } from '@angular/core/testing'

import { SasjsUiComponent } from './sasjs-ui.component'

describe('SasjsUiComponent', () => {
  let component: SasjsUiComponent
  let fixture: ComponentFixture<SasjsUiComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SasjsUiComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(SasjsUiComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
