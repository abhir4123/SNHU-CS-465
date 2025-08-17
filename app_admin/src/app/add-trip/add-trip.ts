import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { TripData } from '../services/trip-data';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-add-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-trip.html',
  styleUrl: './add-trip.css'
})
export class AddTrip implements OnInit {
  addForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private trip: TripData,
    private authentication: Authentication
  ) { }

  ngOnInit() {
    // Redirect if not logged in
    if (!this.authentication.isLoggedIn()) {
      this.router.navigate(['login']);
      return;
    }

    this.addForm = this.formBuilder.group({
      _id: [],
      code: ['', Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required], // keep as string in form; convert on submit
      resort: ['', Validators.required],
      perPerson: ['', Validators.required], // keep as string; API expects string in model
      image: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  public onSubmit() {
    this.submitted = true;
    if (this.addForm.valid) {
      // coerce date to ISO string or Date if API expects a Date
      const payload = { ...this.addForm.value };
      if (payload.start) {
        // If input is "YYYY-MM-DD", make a Date object (API stores Date)
        payload.start = new Date(payload.start);
      }
      this.trip.addTrip(payload)
        .subscribe({
          next: (data: any) => {
            console.log(data);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.addForm.controls; }
}
