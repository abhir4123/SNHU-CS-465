import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripData } from './trip-data'; // existing data class

@Injectable({ providedIn: 'root' })
export class Authentication {
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage, // DOM Storage
    private tripData: TripData
  ) { }

  private authResp: AuthResponse = new AuthResponse();

  // Read JWT from localStorage
  public getToken(): string {
    const out = this.storage.getItem('travlr-token');
    return out ? out : '';
  }

  // Save JWT to localStorage
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Remove JWT (log out)
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Is there a token and is it still valid?
  public isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch {
      return false;
    }
  }

  // Decode token to get current user (call after isLoggedIn)
  public getCurrentUser(): User {
    const token = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  // Call API /login via TripData, store token
  public login(user: User, passwd: string): void {
    this.tripData.login(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value) {
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (err) => console.log('Error:', err)
    });
  }

  // Call API /register via TripData, store token
  public register(user: User, passwd: string): void {
    this.tripData.register(user, passwd).subscribe({
      next: (value: AuthResponse) => {
        if (value) {
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (err) => console.log('Error:', err)
    });
  }
}
