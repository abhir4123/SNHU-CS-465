import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { BROWSER_STORAGE } from '../storage';
import { Trip } from '../models/trip';

@Injectable({ providedIn: 'root' })
export class TripData {
  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) { }

  // Base for all API endpoints
  baseUrl = 'http://localhost:3000/api';

  //Trip endpoints
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.baseUrl}/trips`, formData);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/trips/${formData.code}`, formData);
  }

  // Auth endpoints
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('login', user, passwd);
  }

  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall('register', user, passwd);
  }

  // Shared helper for login/register
  private handleAuthAPICall(
    endpoint: 'login' | 'register',
    user: User,
    passwd: string
  ): Observable<AuthResponse> {
    const formData = { name: user.name, email: user.email, password: passwd };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, formData);
  }
}
