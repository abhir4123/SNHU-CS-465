import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripData } from '../services/trip-data';
import { Trip } from '../models/trip';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html',
  styleUrl: './edit-trip.css'
})
export class EditTrip implements OnInit {
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripData: TripData,
    private authentication: Authentication
  ) { }

  ngOnInit(): void {
    // Redirect if not logged in
    if (!this.authentication.isLoggedIn()) {
      this.router.navigate(['login']);
      return;
    }

    // Retrieve stashed trip ID
    const tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripData.getTrip(tripCode).subscribe({
      next: (value: any) => {
        // API returns an array; take first item
        const record = Array.isArray(value) ? value[0] : value;
        if (record) {
          // If start is a Date, make it an ISO yyyy-MM-dd string for <input type="date">
          const patch = { ...record };
          if (patch.start) {
            const d = new Date(patch.start);
            // If template uses <input type="date">, use yyyy-MM-dd. If plain text, skip.
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            patch.start = `${yyyy}-${mm}-${dd}`;
          }
          this.trip = record;
          this.editForm.patchValue(patch);
          this.message = `Trip: ${tripCode} retrieved`;
        } else {
          this.message = 'No Trip Retrieved!';
        }
        console.log(this.message);
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  public onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      const payload = { ...this.editForm.value };
      if (payload.start) {
        payload.start = new Date(payload.start);
      }
      this.tripData.updateTrip(payload).subscribe({
        next: (value: any) => {
          console.log(value);
          this.router.navigate(['']);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.editForm.controls; }
}
