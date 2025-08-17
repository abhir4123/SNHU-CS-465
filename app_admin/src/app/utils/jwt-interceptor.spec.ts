import { JwtInterceptor } from './jwt-interceptor';
import { Authentication } from '../services/authentication';

describe('JwtInterceptor', () => {
  it('should be created', () => {
    const mockAuth = {
      isLoggedIn: () => false,
      getToken: () => ''
    } as unknown as Authentication;

    const interceptor = new JwtInterceptor(mockAuth);
    expect(interceptor).toBeTruthy();
  });
});
