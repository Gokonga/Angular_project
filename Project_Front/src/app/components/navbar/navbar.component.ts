import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  isWorker = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.updateLoginStatus();
  }
    ngDoCheck() {
      this.updateLoginStatus();
    }
  

  updateLoginStatus() {
    this.isLoggedIn = this.userService.isLoggedIn();
    this.isAdmin = this.userService.isAdmin();
    this.isWorker = this.userService.isWorker();
  }

  logout() {
    this.userService.logoutUser();
    this.updateLoginStatus(); 
  }
}
