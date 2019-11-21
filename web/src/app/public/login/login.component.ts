import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { forEach } from 'lodash';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

  form: FormGroup = this.fb.group({
    'email': ['', [Validators.required, Validators.email]],
    'password': ['', [Validators.required]]
  });

  ngOnInit() {
  }

  login() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }

    console.log(this.form.value);
  }
}
