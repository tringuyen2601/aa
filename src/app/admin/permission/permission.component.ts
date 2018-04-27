import { Component, OnInit,Injectable, Input, Output,  EventEmitter } from '@angular/core';
import { Ng2SmartTableModule,LocalDataSource } from 'ng2-smart-table';
import { ManageBucketsConfig } from '../admin.config';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogService } from "../../confirmation-dialog/confirmation-dialog.service";
import { FormGroup, FormBuilder, Validators,FormControl } from '@angular/forms';
import { AuthService } from "../../services/auth.service";
import { AdminPermissionService } from '../../services/admin.permissions.service';
@Injectable()
@Component({
  selector: 'permission-admin',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
  providers: []
})
export class PermissionComponent implements OnInit {

  constructor(private adminPermissionService: AdminPermissionService,
              private toastrService: ToastrService,
              private confirmationDialogService: ConfirmationDialogService,
              private authService: AuthService) {}
  @Input() globalAdminData: any;
  @Input() listAdminBuckets:any;
  @Output() onDelete = new EventEmitter<boolean>();
  @Output() onCreate = new EventEmitter<any>();
  @Output() onEdit = new EventEmitter<boolean>();

  public bucketAdminData;
  public selectedAdminBucketId;
  public AdminType:any;
  public adminTypeSelected:any;
  public settingsGlobalAdmin:any = ManageBucketsConfig.ManageGlobalAdminSettings;
  public settingsBucketsAdmin:any = ManageBucketsConfig.ManageBucketAdminSettings;

  ngOnInit() {
    this.adminTypeSelected="select";
    this.AdminType=["Manage Global Admin","Manage Buckets Admin"];
    this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
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
    //create active member - company
    public createGlobaAdmin(event){
        let email:string = event.newData['email'];
        let id:string = event.newData['id'];
        console.log('email: ', email);
        console.log('id: ', id);
        if(email!="")
        {
            this.adminPermissionService.addNewMemberAdminToCompanyService(this.authService.getSelectedCompanyId(), email).subscribe(data => {
            console.log('response in adding new member: ', data);
            this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
            this.toastrService.success('New member added', 'Success');
            event.confirm.resolve(event.newData);
          }, err => {
            console.log('Error add new member: ', err);
            this.toastrService.error('Error while adding a member', 'Error');
            event.confirm.reject();
          });
        }
        if(id!="")
        {
             this.adminPermissionService.addExistingMemberAdminToCompanyService(this.authService.getSelectedCompanyId(), id).subscribe(data => {
              console.log('response in adding existing member: ', data);
              this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
              this.toastrService.success('Existing member added', 'Success');
              event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error add existing member: ', err);
              this.toastrService.error('Error while adding an existing member', 'Error');
              event.confirm.reject();
            });
        }
    }
    public deleteGlobalAdmin(event){
        console.log('member to disassociate: ', event);
        let email:string = event.data.email;
        let id:string = event.data.id;
      
        if(email!=""&&email!=null)
        {
            this.adminPermissionService.deletePendingMemberOfCompanyService(this.authService.getSelectedCompanyId(), email).subscribe(data => {
            console.log('response in deleted pending company member: ', data);
            this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
            this.toastrService.success('pending member disassociated', 'Success');
            event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error deleted pending company member: ', err);
              this.toastrService.error('Error while deleting pending company member', 'Error');
              event.confirm.reject();
            });
        }
        if(id!=""&&id!=null)
        {
            this.adminPermissionService.deleteExistingMemberOfCompanyService(this.authService.getSelectedCompanyId(), id).subscribe(data => {
            console.log('response in deleted existing company member: ', data);
            this.getActiveMembersCompany(this.authService.getSelectedCompanyId());
            this.toastrService.success('Existing member disassociated', 'Success');
            event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error deleted existing company member: ', err);
              this.toastrService.error('Error while deleting existing company member', 'Error');
              event.confirm.reject();
            });
        }
        
    }
    
    public callGetSelectedAdminBucket(event) {
        if(event!="selectBucket")
        {
            this.getActiveMembersBucket(event);
        }
        else
        {
             this.bucketAdminData=[];
        }
    }   
     //get active and pending members as bucket admins 
     public getActiveMembersBucket(bucketId){
      this.adminPermissionService.getActiveMembersOfBucketService(this.authService.getSelectedCompanyId(),bucketId).subscribe(data =>{
         let activeMember=(data)?data.data:null;
        this.adminPermissionService.getPendingMembersOfBucketService(this.authService.getSelectedCompanyId(),bucketId).subscribe(data =>{
            let pendingMember=(data)?data.data:null;
            let members=[]
            if(activeMember!=undefined && pendingMember!=undefined)
            {
                 members=activeMember.concat(pendingMember);
            }
            else
            {
                members=activeMember||pendingMember;
            }
            this.bucketAdminData = members;
          }, err => {
            console.log('error bucket: ', err);
            this.toastrService.error('Error while getting pending members bucket', 'Error');
          });
      }, err => {
        console.log('error bucket: ', err);
        this.toastrService.error('Error while getting active members bucket', 'Error');
      });
    }
    //create active member - company
    public createBucketAdmin(event){
        let email:string = event.newData['email'];
        let id:string = event.newData['id'];

        console.log('email: ', email);
        console.log('id: ', id);
        if(email!="")
        {
            this.adminPermissionService.addNewMemberAdminToBucketService(this.authService.getSelectedCompanyId(), this.selectedAdminBucketId,email).subscribe(data => {
            console.log('response in adding new member bucket: ', data);
            this.getActiveMembersBucket(this.selectedAdminBucketId);
            this.toastrService.success('New member added', 'Success');
            event.confirm.resolve(event.newData);
          }, err => {
            console.log('Error add new member: ', err);
            this.toastrService.error('Error while adding a member', 'Error');
            event.confirm.reject();
          });
        }
        if(id!="")
        {
             this.adminPermissionService.addExistingMemberAdminToBucketService(this.authService.getSelectedCompanyId(), this.selectedAdminBucketId,id).subscribe(data => {
              console.log('response in adding existing member: ', data);
              this.getActiveMembersBucket(this.selectedAdminBucketId);
              this.toastrService.success('Existing member added', 'Success');
              event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error add existing member: ', err);
              this.toastrService.error('Error while adding an existing member', 'Error');
              event.confirm.reject();
            });
        }
    }
    public deleteBucketAdmin(event){
        console.log('member to disassociate bucket: ', event);
        let email:string = event.data.email;
        let id:string = event.data.id;
      
        if(email!=""||email!=null)
        {
            this.adminPermissionService.deletePendingMemberOfBucketService(this.authService.getSelectedCompanyId(),this.selectedAdminBucketId,email).subscribe(data => {
            console.log('response in deleted pending company member: ', data);
            this.getActiveMembersBucket(this.selectedAdminBucketId);
            this.toastrService.success('pending member disassociated', 'Success');
            event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error deleted pending company member: ', err);
              this.toastrService.error('Error while deleting pending company member', 'Error');
              event.confirm.reject();
            });
        }
        if(id!=""||id!=null)
        {
            this.adminPermissionService.deleteExistingMemberOfBucketService(this.authService.getSelectedCompanyId(),this.selectedAdminBucketId, id).subscribe(data => {
            console.log('response in deleted existing bucket member: ', data);
            this.getActiveMembersBucket(this.selectedAdminBucketId);
            this.toastrService.success('Existing member disassociated', 'Success');
            event.confirm.resolve(event.newData);
            }, err => {
              console.log('Error deleted existing company member: ', err);
              this.toastrService.error('Error while deleting existing company member', 'Error');
              event.confirm.reject();
            });
        }
        
    }

    public callGet($event){
      this.adminTypeSelected=$event;
    }
}
