<style lang="scss">
    .colSelectForm{
        .el-form-item:first-child .el-transfer-panel,
        .el-form-item:nth-child(2){
            margin-left: 25px;
        }
        .el-form-item:first-child .el-transfer-panel{
            width: 500px;
        }
    }
    .el-checkbox-group{
        height: 300px;
        overflow:auto;
        .el-checkbox{
            display: block;
            padding-left: 20px;
        }
    }
</style>
<template>
    <el-form label-position="top" class="colSelectForm">
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
                            placeholder="请输入">
                        <i slot="prefix"
                           :class="['el-input__icon', 'el-icon-' + inputIcon]"
                           @click="clearQuery"
                        ></i>
                    </el-input>
                    <el-checkbox-group v-model="selectedLabels">
                        <el-checkbox
                                v-for="item in realOptions"
                                :key="item.label"
                                :label="item.label"
                        >
                        </el-checkbox>
                    </el-checkbox-group>

                </div>
            </div>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>
    </el-form>

</template>
<script>
  // import {createHandle, hasParent} from "@/src/utils"
  import './relax'
  export default {
    name: "selectColumn",
    components: {
    },
    props: {
      id: {
        type: String,
        required: true
      },
      col: {
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
        realOptions: [],
        selectedLabels: [],//选中
        selectedColumns:[],//表格显示
        inited: false,
        query: '',
      }
    },
   updated(){

   },
    mounted () {
      // this.$dragging.$on('dragend', () => {});
      this.init();

    },
    computed: {
      checkedSummary(){
        return this.selectedLabels.length + "/" + this.realOptions.length;
      },
      inputIcon() {
        return this.query.length > 0
          ? 'circle-close'
          : 'search';
      },
      storeId() {
        return "table-columns-" + this.id;
      },
      storeColId() {
        return "table-columns-" + this.col;
      },

    },
    methods:{
      init() {
        const allColumns = relax.store.get(this.storeColId);
        if(allColumns){
          this.realOptions = allColumns;
        }else{
          this.realOptions =  this.options.filter(x => !x.excluded);
        }

        const columns = relax.store.get(this.storeId);
        if (columns) {
          this.selectedLabels = columns;
        } else {
          this.selectedLabels = this.realOptions.filter(x => !x.hide).map(x => x.label).value();
          // this.selectedLabels = _.chain(this.options).filter(x => !x.hide).map(x => x.label).value();
        }
        this.inited = true;
      },
      handleReset() {
        relax.store.remove(this.storeId);
        this.inited = false;
        this.init();
      },

      handleAllCheckedChange(value) {
        this.selectedLabels = value
          ? this.realOptions.map(item => item.label)
          : [];
      },
      clearQuery() {
        if (this.inputIcon === 'circle-close') {
          this.query = '';
        }
      }
    },
    watch:{
      realOptions(val){
        const vm = this;
        relax.store.set(vm.storeColId, val);
        this.init();
      },
      selectedLabels(val) {
        const vm = this;
        relax.store.set(vm.storeId, val);
        vm.selectedColumns = _.filter(vm.options, x => _.some(val, y => x.label === y));
        vm.$emit("update:apply", vm.selectedColumns);
      },
      query(query){
        const vm = this;
        vm.realOptions = _.filter(vm.options,x=>x.label.indexOf(query) > -1);
        return vm.realOptions;
      }

    }
  }
</script>
