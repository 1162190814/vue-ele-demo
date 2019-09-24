<style lang="scss">
    .el-transfer-panel{
        width: 500px;
    }
    .el-checkbox{
        display: block;
        padding-left: 20px;
    }
</style>
<template>
    <el-form label-position="top">
        <el-form-item>
            <div class="el-transfer-panel">
                <p class="el-transfer-panel__header">
                    <el-checkbox @change="handleAllCheckedChange">{{title}}
                        <span> {{checkedSummary}}</span>
                    </el-checkbox>
                </p>
                <div>
                    <el-input
                            class="el-transfer-panel__filter"
                            v-model="query"
                            placeholder="请输入"
                    >
                        <i slot="prefix"
                           :class="['el-input__icon', 'el-icon-' + inputIcon]"
                        ></i>
                    </el-input>
                    <el-checkbox-group v-model="selectedColumns">
                        <el-checkbox
                                v-for="item in realOptions"
                                v-dragging="{item:item,list:realOptions}"
                                :key="item.label"
                                :label="item.label"
                        >
                        </el-checkbox>
                    </el-checkbox-group>

                </div>
            </div>
        </el-form-item>
    </el-form>

</template>

<script>
  export default {
    name: "colSelect",
    components: {
    },
    props: {
      id: {
        type: String,
        required: true
      },
      options: {
        type: Array,
        required: true
      },
      apply: {
        type: Array,
        required: true
      },
      props: Object,
      title:String,
    },
    data() {
      return {
        realOptions: this.options.filter(x => !x.excluded),
        selectedLabels: [],
        selectedColumns:this.options.filter(x => !x.hide).map(item=>item.label),
        inited: false,
        query: '',
      }
    },
    mounted () {
      this.$dragging.$on('dragend', () => {});

    },
    computed: {
      checkedSummary(){
         return this.selectedColumns.length+"/"+this.realOptions.length;
      },
      inputIcon() {
        return this.query.length > 0 && this.inputHover
          ? 'circle-close'
          : 'search';
      },
    },
    methods:{
      init() {

      },
      handleAllCheckedChange(value) {
        this.selectedColumns = value
          ? this.realOptions.map(item => item.label)
          : [];
      },


    },
    watch:{
      selectedColumns(val) {

      }
    }
  }
</script>
