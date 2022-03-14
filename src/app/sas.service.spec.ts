import { TestBed } from '@angular/core/testing'

import { SasService } from './sas.service'

describe('SasService', () => {
  let service: SasService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SasService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
