import { TestBed } from '@angular/core/testing';

import { SpringServer } from './spring-server';

describe('MokkyServer', () => {
  let service: SpringServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpringServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
