import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class adminGuard implements CanActivate{
  constructor(private route:Router){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):boolean
   {

    const jwtToken=localStorage.getItem('token');
    const decodedToken=this.decodeToken(jwtToken);
    const role=decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

    if(role=='1'){
      return true;
    }
    else{
      this.route.navigate(['/login']);
      return false;
    }
    
  }
  
  private decodeToken(token: string | null): any{
    if(!token) return null;

    try{
      return JSON.parse(atob(token.split('.')[1]));
    }catch(e){
      console.error('Error decoding JWT token', e);
      return null;
    }
   }  
};
