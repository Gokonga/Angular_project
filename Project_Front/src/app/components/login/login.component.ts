import { Component } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm!:FormGroup;
  errormessage='';

  

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private router:Router
  ){}

  ngOnInit(){
    this.CreateLoginForm();
    localStorage.clear();

  }

  CreateLoginForm(){
    this.loginForm=this.fb.group({
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required]]
    })

  }
  get formControls(){
    return this.loginForm.controls;
  }

  Login(){
    if(this.loginForm.valid){
      const userdata=this.loginForm.value;
      this.userService.loginUser(userdata).subscribe({
        next:(response)=>{
          console.log("Logged in",response);
          const jwtToken=response;
          localStorage.setItem('token',jwtToken);

          const decodedToken=this.userService.decodeToken(jwtToken);
          const role=decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']

          if(role==='1'){
            this.router.navigate(['/admin']);
          }else if(role=== '2'){
            this.router.navigate(['/worker']);
          }
          else{
            console.log('Login failed. Please check your credentials', 'Error');
          }
        },
        error:(error) =>{
          console.log('login failed: ',error);
          this.errormessage=error.status;
          
        }
      })
    }
  }

  


  goToRegister(){
    this.router.navigate(['/register']);
  }


}
