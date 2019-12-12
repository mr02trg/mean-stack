import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { forEach } from 'lodash';

import { UserService } from 'src/app/services/user.service';
import { ITokenRequest } from 'src/app/models/common/ITokenRequest';
import { IActivateUserRequest } from 'src/app/models/users/IActivateUserRequest';

@Component({
  selector: 'app-activate',
  templateUrl: './activate.component.html',
  styleUrls: ['./activate.component.scss']
})
export class ActivateComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  form: FormGroup = this.fb.group({
    'password': ['', [Validators.required]]
  });

  token: string;
  step: number = 0;

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.token)
      this.verifyToken()
  }

  verifyToken() {
    this.userService.VerifyActivationToken(<ITokenRequest> {token: this.token})
        .subscribe(success => {
          if (success.result)
            this.step += 1;
        }, error => {
          console.error('Failed to verify token');
        });
  }


  activateUser() {
    if (this.form.invalid) {
      forEach(this.form.controls, c => c.markAsTouched());
      return;
    }

    this.userService.ActivateUser(<IActivateUserRequest> { ...this.form.value, token: this.token })
        .subscribe(success => {
          if (success.result)
            this.step += 1;
        }, error => {
          console.error('Failed to activate user');
        })
  }
}
