import { Component} from '@angular/core';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { Job } from '../interfaces/job';
import { UserService } from '../services/user.service';
import { Checkpassword } from '../services/user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls:['./register.component.css']
})
export class RegisterComponent {

  registrationForm!:FormGroup;
  jobOptions: Job[] = [];

  constructor(
    private userService:UserService,
    private fb:FormBuilder,
  ){}

ngOnInit():void{
  this.CreateForm();
  this.fetchJobOptions();
}

  CreateForm():void{
    this.registrationForm=this.fb.group({
      firstName: ['',Validators.required],
      lastName: ['',Validators.required],
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required, Validators.minLength(6)]],
      confirmPassword: ['',Validators.required],
      jobId: [null,Validators.required]

    },
    {
      validators:Checkpassword('password','confirmPassword')
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
        },
        error: (error) => {
          console.log('Registration failed: ', error);
        }
      });
      this.registrationForm.reset();

    }
  }

}


 