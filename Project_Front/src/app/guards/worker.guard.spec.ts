import { TestBed } from '@angular/core/testing';
import { workerGuard } from './worker.guard';

describe('workerGuard', () => {
 let guard:workerGuard

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard=TestBed.inject(workerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
