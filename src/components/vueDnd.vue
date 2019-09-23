<style lang="scss">
 .el-checkbox{
     display: block;
 }
</style>
<template>
    <div>
        <el-checkbox
                v-model="realUser"
                v-for="item in data"
                v-dragging="{item:item,list:data}"
                :key="item.text"
        >{{item.text}}
        </el-checkbox>
    </div>
</template>

<script>
    export  default {
      name:"vueDnd",
      props:{
        data:{
          type:Array,
          default: function () {return []}
        },
        label:{
          type:Boolean,
          default:true,
        },
      },
      data(){
         return{
           realUser:[],
         }
      },
      methods:{
        init(){
          console.log(this.prop.data);
          console.log(this.prop.label)
          // this.realUser = this.prop.data;
        }
      },
      mounted () {
        this.$dragging.$on('dragged', ({ value }) => {
          console.log(value.item)
          console.log(value.list)
          console.log(value.otherData)
        })
        this.$dragging.$on('dragend', () => {

        })
      }

    }
</script>