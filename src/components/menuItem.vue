<style lang="scss">
</style>
<template>
    <div class="menu-item-wrapper">
        <template v-for="item in menus" v-if="!item.noMenu">  //遍历路由信息，排除非菜单路由
            <el-submenu v-if="item.children" :index="item.name" :key="item.name"> //判断是否有子路由，有的话需要遍历子路由
                <template slot="title">
                    <i class="fa fa-bath" aria-hidden="true"></i>
                    <span v-if="item.meta && item.meta.title">{{item.meta.title}}</span>
                </template>
                <template v-for="child in item.children">
                    <router-link :to="child.path" :key="child.name">
                        <el-menu-item :index="item.path + child.path" >
                            <i class="fa fa-bath" aria-hidden="true"></i>
                            <span v-if="child.meta && child.meta.title" slot="title">{{child.meta.title}}</span>
                        </el-menu-item>
                    </router-link>
                </template>
            </el-submenu>
            <router-link v-else :to="item.path" :key="item.name">  //没有子路由则直接进入这一步
                <el-menu-item :index="item.path" class="submenu-title-noDropdown">
                    <i class="fa fa-bath" aria-hidden="true"></i>
                    <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
                </el-menu-item>
            </router-link>
        </template>
    </div>
</template>

<script>
  export default {
    name: "menuItem",
  }
</script>
