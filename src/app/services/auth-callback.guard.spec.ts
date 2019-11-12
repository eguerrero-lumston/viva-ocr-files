import { TestBed, async, inject } from '@angular/core/testing';

import { AuthCallbackGuard } from './auth.guard';

describe('AuthCallbackGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthCallbackGuard]
    });
  });

  it('should ...', inject([AuthCallbackGuard], (guard: AuthCallbackGuard) => {
    expect(guard).toBeTruthy();
  }));
});
