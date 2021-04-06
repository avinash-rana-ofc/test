import { TestBed } from '@angular/core/testing';

import { InstanceFormService } from './instance-form.service';

describe('InstanceFormService', () => {
  let service: InstanceFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstanceFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
