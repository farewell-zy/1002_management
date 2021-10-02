<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cFrom" :disabled="!isShowList">
      <el-form-item label="一级分类">
        <!-- select必须有value属性，没有会报警告 -->
        <el-select v-model="cFrom.category1Id" placeholder="请选择" @change="handlerCategory1">
          <el-option :label="c1.name" :value="c1.id" v-for="(c1, index) in categort1List" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="cFrom.category2Id" placeholder="请选择" @change="handlerCategory2">
          <el-option :label="c2.name" :value="c2.id" v-for="(c2, index) in categort2List" :key="c2.id" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="cFrom.category3Id" placeholder="请选择" @change="handlerCategory3">
          <el-option :label="c3.name" :value="c3.id" v-for="(c3, index) in categort3List" :key="c3.id" ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelector",
  props: ['isShowList'],
  data() {
    return {
      categort1List: [],
      categort2List: [],
      categort3List: [],
      cFrom: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategort1List();
  },
  methods: {
    async getCategort1List() {
      const result = await this.$API.category.getCategory1();
      
      if (result.code === 200) {
        this.categort1List = result.data;
      }
    },

    // 选中了一级分类的回调
    async handlerCategory1(category1Id) {
      // 用户选中一级需要清空23级
      this.categort2List = [];
      this.categort3List = [];
      this.cFrom.category2Id = '';
      this.cFrom.category3Id = '';

      // 选中一级要触发自定义事件 把一级的id传递给父组件
      // this.$emit('handlerCategory', category1Id) // 因为我们的区分不了是几级id
      this.$emit('handlerCategory', {categoryId:category1Id,level:1})

      const result = await this.$API.category.getCategory2(category1Id);
      if (result.code === 200) {
        this.categort2List = result.data;
      }
    },

    // 选中了二级分类的回调
    async handlerCategory2(category2Id) {
      // 选中二级需要把3级清空
      this.categort3List = []
      this.cFrom.category3Id = ''
      // 选中一级要触发自定义事件 把一级的id传递给父组件
      // this.$emit('handlerCategory', category2Id)
      this.$emit('handlerCategory', {categoryId:category2Id,level:2})

      const result = await this.$API.category.getCategory3(category2Id);
      if (result.code === 200) {
        this.categort3List = result.data;
      }
    },

    // 选中了三级分类的回调
    handlerCategory3(category3Id) {
      // 选中3级要出发自定义时间 把3级的id传递给父组件
      // this.$emit('handlerCategory', category3Id)
      this.$emit('handlerCategory', {categoryId:category3Id,level:3})
    },
  },
};
</script>



