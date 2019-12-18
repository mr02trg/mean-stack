import { COMMA, TAB } from '@angular/cdk/keycodes';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss']
})
export class TagComponent implements OnInit {

  readonly separatorKeysCodes: number[] = [TAB, COMMA];
  visible = true;
  selectable = true;
  addOnBlur = true;

  @Input()
  placeholder = "Tags"

  @Input()
  tags: string[] = [];

  @Input()
  removable = true;

  @Input()
  form: FormGroup;

  ngOnInit() {
  }

  add (event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.tags.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.updateForm();
  }

  remove (tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }

    this.updateForm();
  }

  // register tags with form
  updateForm() {
    if (this.form) {
      this.form.patchValue({
        'tags': this.tags
      });
      this.form.updateValueAndValidity();
    }
  }
}
