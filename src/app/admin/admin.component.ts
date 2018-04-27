import { Component, OnInit,Injectable } from '@angular/core';
import { AdminBucketService} from '../services/admin.bucket.service';

import { ApiService } from "../app.service";
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from "../confirmation-dialog/confirmation-dialog.service";
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { AdminAccountService} from '../services/admin.account.service';
import { AdminPermissionService } from '../services/admin.permissions.service';
import { AdminCustomValidators } from './admin-custom-validator';
import { AuthService } from "../services/auth.service";
@Injectable()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: []
})
export class AdminComponent implements OnInit {

  constructor(private apiService: ApiService,
              private adminBucketService: AdminBucketService,
              private adminAccountService: AdminAccountService,
              private adminPermissionService: AdminPermissionService,
              private toastrService: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private authService:AuthService) { 
  }
    
   public bucketsData;
   public accountData;
   public globalAdminData;
   public bucketAdminData;
   public selectedAdmin;
   public listAdminBuckets:any;
   
   //selected bucket id for account tab
   public selectedAccountBucketId:string = "";
   public accountObject: any;

  ngOnInit() {
    this.selectedAdmin="select";
    //get list of buckets for company
    this.getAllBucketsOfCompany(this.authService.getSelectedCompanyId());
    this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
    this.getListAccountCompanyBucket(this.authService.getSelectedCompanyId(), this.selectedAccountBucketId);
  }

  //get all buckets of company
  public getAllBucketsOfCompany(companyId){
    this.adminBucketService.getBucketsOfCompanyService(companyId).subscribe(data =>{
      this.bucketsData = data.data;
      this.listAdminBuckets=this.bucketsData;
    }, err => {
      this.toastrService.error(err.error.message, 'Error');
    });
  }
  
  //create bucket
  public onCreateConfirm(event) {
    let data: any = event;
    console.log('Bucket created: ', data);
    if(data){
      this.bucketsData = data;
      this.getAllBucketsOfCompany(this.authService.getSelectedCompanyId());
    }
  }

  //delete bucket
  public onDeleteBucket(event){
    let deleted: Boolean = event;
    console.log('Delete Bucket: ', deleted);
    if(deleted){
      this.getAllBucketsOfCompany(this.authService.getSelectedCompanyId());
    }
  }

  //edit bucket
  public onEditBucket(event){
    let edited: Boolean = event;
    console.log('Edited Bucket: ', edited);
    if(edited){
      this.getAllBucketsOfCompany(this.authService.getSelectedCompanyId());
    }
  }

  private getListAccountCompanyBucket(companyId, bucketId){
    if(bucketId != ""){
      this.adminAccountService.getListAccountOfCompanyBucket(companyId, bucketId).subscribe(res => {
          console.log('AccountCompanyBucket: ', res);
          this.accountData = res.data;
        }, err => {
          console.log("err",err)
            this.toastrService.error(err.message, 'Error');
      });
    }
  }

  //get active and pending members as company admins 
  public getActiveMembersCompany(companyId){
    this.adminPermissionService.getActiveMembersOfCompanyService(this.authService.getSelectedCompanyId()).subscribe(data =>{
        let activeMember=(data)?data.data:null;
      this.adminPermissionService.getPendingMembersOfCompanyService(this.authService.getSelectedCompanyId()).subscribe(data =>{
          let pendingMember=(data)?data.data:null;
          let members=activeMember.concat(pendingMember);
          this.globalAdminData = members;
        }, err => {
          console.log('error bucket: ', err);
          this.toastrService.error('Error while getting pending members', 'Error');
        });
    }, err => {
      console.log('error bucket: ', err);
      this.toastrService.error('Error while getting active members', 'Error');
    });
  }

}
