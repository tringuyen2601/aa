import { Component } from '@angular/core';
import { SpinnerComponent } from "./shared/spinner/spinner.component";

@Component({
  selector: 'body',
  template:`<spinner [entryComponent]="spinnerComponent" [debounceDelay]="1"></spinner>
            <router-outlet></router-outlet>`
})
export class AppComponent {
  public spinnerComponent = SpinnerComponent;
}
