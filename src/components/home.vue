<style lang="scss">
    .app{
        .el-aside{
            height: 100%;
            border-right:1px solid rgb(230, 230, 230);
            overflow: hidden;
            .el-button{
                border:0;
                width: 64px;
                height: 54px;
            }
        }
        &-side-collapsed{
            width: 64px!important;
        }
        &-side-expanded{
            width: 200px!important;
        }
    }

</style>
<template>
    <el-container class="app">
        <el-aside :class="isCollapse ? 'app-side-collapsed' : 'app-side-expanded'">
            <el-button @click="toggleSideBar" style="width: 64px;height: 54px"><i class="el-icon-menu"></i></el-button>
            <el-menu :collapse="isCollapse" router>
                <menu-item :menus="menus"></menu-item>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header class="app-header">
               header
            </el-header>

            <el-main class="app-body">
                <template>
                    <router-view/>
                </template>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
  import MenuItem from "./menuItem";
  export default {
    name: "home",
    components: {MenuItem},
    data(){
      return{
        isCollapse:false,
        menus:this.$store.state.menu,
      }
    },
    methods:{
      toggleSideBar() {
        this.isCollapse = !this.isCollapse
      },
    }
  }
</script>
