import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const checkPassword: ValidatorFn=(
  control :AbstractControl):
  ValidationErrors|null=>{
    const passwordControl =control.get('password');
    const confirmPasswordControl=control.get("confirmPassword")

    if(!passwordControl || !confirmPasswordControl){
      return null;
    }
    if (passwordControl.value !== confirmPasswordControl.value){
      confirmPasswordControl.setErrors({ passwordMismatch: true });
      return {passwordMismatch:true};
    }
    else{
    confirmPasswordControl.setErrors(null);
    }
    return null;
  };

