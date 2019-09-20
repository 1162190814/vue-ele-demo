<!--
<template>
    <div>select</div>
</template>
<script>
    export default {
      name:'RxColumnSelect',
    }
</script>-->
<style lang="scss">
    .el-transfer{
        .el-transfer-panel:nth-child(2){
            display: none;
        }
    }
</style>

<template>
    <el-form label-position="top">
        <el-form-item>
            <trans
                    filterable
                    :filter-method="filterMethod"
                    filter-placeholder="请输入"
                    :titles="['数据列']"
                    :props="{key: 'label', label: 'label', disabled: 'disableSelection'}"
                    v-model="selectedLabels"
                    :data="realOptions">
            </trans>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="handleReset">重置</el-button>
        </el-form-item>

    </el-form>

</template>


<script>
  // import {createHandle, hasParent} from "@/src/utils"

  import Trans from "./trans";
  import vuedraggable from 'vuedraggable';
  export default {
    name: "RxColumnSelect",
    components: {Trans},
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
      }
    },
    mounted() {
      this.init();
    },
    data() {
      return {
        selectedLabels: [],
        selectedColumns: [],
        realOptions: this.options.filter(x => !x.excluded),
        inited: false
      }
    },
    watch: {
      selectedLabels(val) {
        const vm = this;
        relax.store.set(vm.storeId, val);
        vm.selectedColumns = _.filter(vm.options, x => _.some(val, y => x.label === y));
        vm.$emit("update:apply", vm.selectedColumns);
      }
    },
    beforeMount() {
    },
    computed: {
      storeId() {
        return "table-columns-" + this.id;
      }
    },
    methods: {
      init() {
        const columns = relax.store.get(this.storeId);
        // console.log(columns);
        if (columns) {
          this.selectedLabels = columns;
        } else {
          this.selectedLabels = _.chain(this.options).filter(x => !x.hide).map(x => x.label).value();
        }
        this.inited = true;
      },
      handleReset() {
        relax.store.remove(this.storeId);
        this.inited = false;
        this.init();
      },
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
    }
  }
</script>



