import { Component, OnInit } from '@angular/core';
import { Headers, Http, URLSearchParams,Response,RequestOptions } from '@angular/http';
import { Router,} from '@angular/router';
import { HeaderService } from '../header/header.service';
import { HeaderComponent} from '../header/header.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [HeaderService,HeaderComponent]
})
export class HomeComponent implements OnInit {

  constructor(private userInfoService: HeaderService,private router: Router,private headerInfoComponent: HeaderComponent) { }

  ngOnInit() {
    let localStorageData=localStorage.getItem("user");
   
    if(localStorageData!="undefined"){
       //this.displaySolution="hideDiv";//uncomment this when you need dropdown functionality
       // this.router.navigate(['/workflow-approver']); 
       this.router.navigate(['/auth']);
    }
    else
    {
       this.router.navigate(['/home']);
       this.headerInfoComponent.loggedIn=false;
    }
  }
}
