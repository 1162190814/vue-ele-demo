<style lang="scss">
</style>
<template>
    <div>
        ffffff
        <vue-dnd :data="user" :label="label"></vue-dnd>
    </div>
</template>

<script>
  import VueDnd from "./vueDnd";
  export default {
    name: "vueDndTest",
    components: {VueDnd},
    data(){
      return{
        label:false,
        user:[{
          text: "用户ID",
          property: "USERID",
          hide:true
        }, {
          text: "帐户",
          property: "ACCOUNT",
        }, {
          text: "姓名",
          property: "USERNAME",

        },  {
          text: "隶属",
          property: "DEPARTMENTPATH",

        },{
          text: "认证数据数量",
          property: "COUNTS",
        }, {
          text: "职位",
          property: "POST",
          hide:true
        },{
          text: "邮箱",
          property: "EMAIL",
          hide:true
        },{
          text: "电话号码",
          property: "TEL",
          hide:true
        },
          {
            text: "传真号",
            property: "FAX",
            hide:true
          },
          {
            text: "帐户状态",
            isHtml: false,
          }, {
            text: "密级",
            property: "USERSECRETLEVEL_text",
          }, {
            text: "角色",
            property: "ROLE_NAMES",
            hide:true,
          }, {
            text: "卡号",
            property: "AUTH_CODES",
          },{
            text: "最后登录时间",
            property: "LASTLOGINTIME_text",
            hide:true,
          }, {
            text: "最后密码更改时间",
            width: "140",
          }, {
            text: "锁定状态",
            property: "LOCKED_text"
          }, {
            text: "绑定认证数据状态",
            property: "BIND_STATUS",
          }],
      }
    },
  }
</script>
