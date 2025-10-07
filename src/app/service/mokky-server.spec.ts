import { TestBed } from '@angular/core/testing';

import { MokkyServer } from './mokky-server';

describe('MokkyServer', () => {
  let service: MokkyServer;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MokkyServer);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
