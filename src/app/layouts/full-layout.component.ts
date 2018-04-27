import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-layout',
  templateUrl: './full-layout.component.html',
  styleUrls: ['./full-layout.component.css'],
  
})
export class FullLayoutComponent implements OnInit {
  constructor(private router: Router){}
  public disabled: boolean = false;
  public status: {isopen: boolean} = {isopen: false};

  public toggled(open: boolean): void {
    console.log('Dropdown is now: ', open);
  }
  public toggleDropdown($event: MouseEvent): void {
    $event.preventDefault();
    $event.stopPropagation();
    this.status.isopen = !this.status.isopen;
  }
  ngOnInit(): void {
      console.log("oninit in full layout",window.location.href);
      let urlAfterLogin=(window.location.href);
      let decode1=decodeURIComponent(urlAfterLogin);
      let decode2=decode1.split("=");
      if(decode2.length!=0)
      {
         //if((localStorage.getItem("user")!=undefined || localStorage.getItem("user")==null)&&(localStorage.length==0))
          let decode3=decodeURIComponent(decode2[1]);
          localStorage.setItem("user",decode3);
          if(localStorage.getItem("user")!="undefined")
          {
                this.router.navigate(['/auth']);
          }
      }
      //this.router.navigate(['/home']); //uncomment to make roles authentication work
      //this.router.navigate(['/workflow-approver']);//comment once finish development
  }
}
