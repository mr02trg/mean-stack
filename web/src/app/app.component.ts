import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageService } from './services/page.service';
import { SpinnerService } from './services/spinner.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private pageService: PageService,
    private spinnerService: SpinnerService,
    private ngxSpinner: NgxSpinnerService
  ) {
  }

  pagePadding: boolean;
  subscription = new Subscription();


  ngOnInit() {
    // page service
    this.subscription.add(
      this.pageService.getPadding().subscribe(x => {
        setTimeout(() => this.pagePadding = x , 0)
      })
    )

    // spinner service
    this.subscription.add(
      this.spinnerService.getSpinner().subscribe(x => {
        if (x)
          this.ngxSpinner.show();
        else 
          this.ngxSpinner.hide();
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
