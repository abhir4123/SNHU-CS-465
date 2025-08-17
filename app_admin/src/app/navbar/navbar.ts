import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Authentication } from '../services/authentication';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  constructor(private authentication: Authentication) { }

  ngOnInit(): void { }

  public isLoggedIn(): boolean {
    return this.authentication.isLoggedIn();
  }

  public onLogout(): void {
    this.authentication.logout();
  }
}
