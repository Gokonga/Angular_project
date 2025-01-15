import { Component} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Job } from '../../interfaces/job';
import { UserService } from '../../services/user.service';
import { checkPassword } from '../validators/checkPassword.Validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {

  registrationForm!:FormGroup;
  jobOptions: Job[] = [];
  errorMessage='';

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
    private router:Router
  ){}

ngOnInit():void{
  this.CreateRegForm();
  this.fetchJobOptions();
}

  CreateRegForm():void{
    this.registrationForm=this.fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
      jobId: [null,Validators.required]

    },
    {
      validators:checkPassword
    }
  )
  }
  get formControls(){
    return this.registrationForm.controls;
  }

  fetchJobOptions(){
    this.userService.getJobOptions().subscribe({
      next:(response)=>{
        console.log('job options',response);
        this.jobOptions=response as Job[];
      },
      error:(error)=>{
        console.error('error Fetching job options',error);
        
      }
    });
  }

  Register():void{
    if(this.registrationForm.valid){
      const {confirmPassword,jobId,...userData}=this.registrationForm.value;
      const job=jobId as Job;
      this.userService.registerUser({...userData,jobId: job.id}).subscribe({
        next:(response)=>{
          console.log("Registration successful: ",response);
          this.registrationForm.reset();
          this.router.navigate(['/login'])
        },
        error: (error) => {
          console.log('Registration failed: ', error);
          this.errorMessage=error.status;
        }
      });

    }
  }

  goToLogin(){
    this.router.navigate(['/login']);
  }

}


 