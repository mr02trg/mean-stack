import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { forEach } from 'lodash';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  form: FormGroup = this.fb.group({
    'name': ['', [Validators.required]],
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required]]
  });

  ngOnInit() {
  }

  register() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }

    this.userService.RegisterUser(<IUser>{...this.form.value});
  }
}
