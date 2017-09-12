import { Component, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy, PopStateEvent } from '@angular/common';
import { ApiService } from './api.service';
import { UiService } from './ui.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { '(window:keydown.esc)': 'escapePressed($event)' },
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}]
})
export class AppComponent {
  constructor(
      public api: ApiService,
      public ui: UiService,
      public view: ViewContainerRef,
      public resolver: ComponentFactoryResolver,
      private location: Location
  ) {
    this.ui.registerAppComponent(this);
  }

  escapePressed(event: any) {
    if (!this.ui.back()) {
      this.api.up();
    }
  }

  getEnv() {
    return this.ui.getEnv();
  }
}
