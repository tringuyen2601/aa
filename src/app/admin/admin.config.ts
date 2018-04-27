export class ManageBucketsConfig {
   public static ManageBucketSettings: Object = {
                    add: {
                        addButtonContent: '<i class="fa fa-2x fa-plus-circle add-button" style="font-size: 18px;!important"></i>', 
                        createButtonContent: '<i class="fa fa-2x fa-check create-button" style="font-size: 18px;"></i>',
                        cancelButtonContent: '<i class="fa fa-2x fa-times cancel-button" style="font-size: 18px;"></i>',
                        confirmCreate: true
                    },
                    edit: {
                        editButtonContent: '<i class="fa fa-2x fa-edit edit-button" style="font-size: 18px;"></i>',
                        saveButtonContent: '<i class="fa fa-2x fa-check save-button" style="font-size: 18px;"></i>',
                        cancelButtonContent: '<i class="fa fa-2x fa-times cancel-button" style="font-size: 18px;"></i>',
                        confirmSave: true
                    },
                    delete: {
                        deleteButtonContent: '<i class="fa fa-2x fa-trash delete-button" style="font-size: 18px;"></i>',
                        confirmDelete: true
                    },
                     actions: {
                        columnTitle: 'Actions',
                        add: true,
                        edit: true,
                        delete: true,
                        position: 'right', // left|right
                    },
                    columns: {
                        name: {
                               title: 'Bucket Name'
                        },
                        username: {
                               title: 'User Name'
                              },
                        email: {
                                title: 'Email'
                              }
                    }
            };
      public static UpdateAccountSettings: Object = {
                    edit: {
                    },
                    delete: {
                        deleteButtonContent: '<i class="fa fa-2x fa-trash delete-button" style="font-size: 18px;"></i>',
                        confirmDelete: true
                    },
                     actions: {
                        columnTitle: 'Actions',
                        add: false,
                        edit: false,
                        delete: true,
                        position: 'right', // left|right
                    },
                    columns: {
                                id: 
                                {
                                        title: 'Account ID'
                                },
                                name:
                                {
                                        title: 'Public Account Name'
                                },
                                targetURL:
                                {
                                        title: 'URL'
                                }
                    }
            };
         public static ManageGlobalAdminSettings: Object = {
                   add: {
                        addButtonContent: '<i class="fa fa-2x fa-plus-circle add-button" style="font-size: 18px;!important"></i>', 
                        createButtonContent: '<i class="fa fa-2x fa-check create-button" style="font-size: 18px;"></i>',
                        cancelButtonContent: '<i class="fa fa-2x fa-times cancel-button" style="font-size: 18px;"></i>',
                        confirmCreate: true
                    },
                    delete: {
                        deleteButtonContent: '<i class="fa fa-2x fa-trash delete-button" style="font-size: 18px;"></i>',
                        confirmDelete: true
                    },
                     actions: {
                        columnTitle: 'Actions',
                        add: true,
                        edit: false,
                        delete: true,
                        position: 'right', // left|right
                    },
                    columns: {
                                id: 
                                {
                                        title: 'Bosch User ID',
                                        editable: false,
                                        addable: false
                                },
                                username:
                                {
                                        title: 'User Name',
                                        editable: false,
                                        addable: false
                                },
                                email:
                                {
                                        title: 'Email'
                                }
                    }
            };
            public static ManageBucketAdminSettings: Object = {
                     add: {
                        addButtonContent: '<i class="fa fa-2x fa-plus-circle add-button" style="font-size: 18px;!important"></i>', 
                        createButtonContent: '<i class="fa fa-2x fa-check create-button" style="font-size: 18px;"></i>',
                        cancelButtonContent: '<i class="fa fa-2x fa-times cancel-button" style="font-size: 18px;"></i>',
                        confirmCreate: true
                    },
                    delete: {
                        deleteButtonContent: '<i class="fa fa-2x fa-trash delete-button" style="font-size: 18px;"></i>',
                        confirmDelete: true
                    },
                     actions: {
                        columnTitle: 'Actions',
                        add: true,
                        edit: false,
                        delete: true,
                        position: 'right', // left|right
                    },
                    columns: {
                                 id: 
                                {
                                        title: 'Bosch User ID',
                                        editable: false,
                                        addable: false
                                },
                                username:
                                {
                                        title: 'User Name',
                                        editable: false,
                                        addable: false
                                },
                                email:
                                {
                                        title: 'Email'
                                }
                    }
            };
           public static URLAttributesSettings: Object = {
                     add: {
                        addButtonContent: '<i class="fa fa-2x fa-plus-circle add-button" style="font-size: 18px;!important"></i>', 
                        createButtonContent: '<i class="fa fa-2x fa-check create-button" style="font-size: 18px;"></i>',
                        cancelButtonContent: '<i class="fa fa-2x fa-times cancel-button" style="font-size: 18px;"></i>',
                        confirmCreate: true
                    },
                    delete: {
                        deleteButtonContent: '<i class="fa fa-2x fa-trash delete-button" style="font-size: 18px;"></i>',
                        confirmDelete: true
                    },
                     actions: {
                        columnTitle: 'Actions',
                        add: true,
                        edit: false,
                        delete: true,
                        position: 'right', // left|right
                    },
                    columns: {
                                // slno: 
                                // {
                                //         title: 'SL.No',
                                //         editable: false,
                                //         addable: false
                                // },
                                name:
                                {
                                        title: 'Name'
                                },
                                value:
                                {
                                        title: 'Value'
                                }
                    }
            };
}