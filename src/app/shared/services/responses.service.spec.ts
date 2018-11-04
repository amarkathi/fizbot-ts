import { TestBed, inject } from '@angular/core/testing';

import { ResponsesService } from './responses.service';

describe('ResponsesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResponsesService]
    });
  });

  it('should be created', inject([ResponsesService], (service: ResponsesService) => {
    expect(service).toBeTruthy();
  }));
});
