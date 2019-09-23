<template>
    <vuedraggable class="wrapper" v-model="list">
            <el-checkbox
                    class="item"
                    :key="item"
                    v-for="item in list">
                <option-content :option="item">{{item}}</option-content>
            </el-checkbox>
    </vuedraggable>
</template>

<script>
  import vuedraggable from 'vuedraggable';

  export default {
    name: 'HelloWorld',
    components: {vuedraggable},
    props: {
    },
    data() {
      return {
        list: [1,2,34,4,54,5]
      }
    },
    methods: {
    }
  }
</script>
<style scoped>
    .wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }
    .item{
        width: 300px;
        height: 50px;
        background-color: #42b983;
        color: #ffffff;
    }
</style>