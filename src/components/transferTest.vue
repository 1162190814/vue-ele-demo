<style lang="scss">
</style>
<template>
    <div>
        <select-column class="colSelect" id="esmat-user-management-table" :options="tblUser.columns"
                          :apply.sync="tblUser.apply" :title="title" :allCol="allCol"></select-column>
    </div>
</template>
<script>
    import SelectColumn from "./selectColumn";
  export default {
    name: "transferTest",
    components:{SelectColumn},
    data(){
      return{
        title:"数据列",
        allCol:"esmat-user-selection-table",
        tblUser: {
          loading: false,
          apply: [],
          columns: [{
            label: "用户ID",
            property: "USERID",
            hide:true

          }, {
            label: "帐户",
            property: "ACCOUNT",
            sortable: "custom",
            sortColumn: "account"
          }, {
            label: "姓名",
            property: "USERNAME",
            sortable: "custom",
            sortColumn: "username"
          },  {
            label: "隶属",
            property: "DEPARTMENTPATH",
            sortable: "custom",
            sortColumn: "departmentId"
          },{
            label: "认证数据数量",
            property: "COUNTS",
            // excluded: !shiroTrie.hasRole(["sysadmin"]),
            formatter(row){
              if(row.COUNTS){
                return row.COUNTS + "张";
              }else{
                return "0张";
              }
            }
          }/*, {
            label: "激活状态",
            isHtml: true,
            formatter(row) {
              return row.ENABLE ? `<i class="el-icon-check"></i>` : `<i class="el-icon-close"></i>`;
            }
          }*/, {
            label: "职位",
            property: "POST",
            hide:true
          },{
            label: "邮箱",
            property: "EMAIL",
            hide:true
          },{
            label: "电话号码",
            property: "TEL",
            hide:true
          },
//            {
//            label: "传真号",
//            property: "FAX",
//            hide:true
//          },
            {
              label: "帐户状态",
              isHtml: false,
              // excluded: shiroTrie.hasRole(["sysadmin"]),
              formatter(row) {
                return row.ENABLE ? `已激活` : `未激活`;
              }
            }, {
              label: "密级",
              // excluded: shiroTrie.hasRole(["sysadmin"]),
              property: "USERSECRETLEVEL_text",
              sortable: "custom",
              sortColumn: "userSecretlevel"
            }, {
              label: "角色",
              // excluded: shiroTrie.hasRole(["sysadmin"]),
              property: "ROLE_NAMES",
              hide:true,
            }, /*, {
            label: "卡号",
            property: "AUTH_CODES",
          }*/ {
              label: "最后登录时间",
              property: "LASTLOGINTIME_text",
              sortable: "custom",
              sortColumn: "lasyLoginTime",
              hide:true,
            }, {
              label: "最后密码更改时间",
              // property: "LASTPWDUPDATETIME_text",
              width: "140",
              formatter(row){
                return row.LASTPWDUPDATETIME_text ? row.LASTPWDUPDATETIME_text : row.LASTPWDRESETTIME_text;
              },
              sortable: "custom",
              sortColumn: "lastPwdUpdateTime",
              hide:true
            }, {
              label: "锁定状态",
              // excluded: shiroTrie.hasRole(["sysadmin"]),
              property: "LOCKED_text"
            }/*, {
            label: "绑定认证数据状态",
            property: "BIND_STATUS",
          }*/],

          tableModel: {
            pager: {
              pageSize: 10,
              currentPage: 1,
              totalCount: 0
            }
          }
        },
      }
    }
  }
</script>
