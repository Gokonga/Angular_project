import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';  
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})


export class workerGuard implements CanActivate{
  constructor(
    private route:Router,
    private userService:UserService
  ){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean{

    const jwtToken=localStorage.getItem('token');
    const decodedToken=this.userService.decodeToken(jwtToken);
    const role=decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    if(role=='2'){
      return true;
    }
    else{
      this.route.navigate(['/login']);
      return false;
    }
    
  }
 
};
