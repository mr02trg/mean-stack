import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { PageService } from './services/page.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  constructor(
    private pageService: PageService
  ) {
  }

  pagePadding: boolean;
  subscription = new Subscription();


  ngOnInit() {
    this.subscription.add(
      this.pageService.getPadding().subscribe(x => {
        setTimeout(() => this.pagePadding = x , 0)
      })
    )
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
