<template>
  <el-form>
    <el-form-item label="SPU名称" label-width="100px">
      <el-input v-model="model" placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌" label-width="100px">
      <el-select v-model="model" placeholder="请选择">
        <el-option label="label" value="value"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" label-width="100px">
      <el-input type="textarea" v-model="form.desc" rows="4" placeholder="SPU描述"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片" label-width="100px">
      <el-upload
        action="https://jsonplaceholder.typicode.com/posts/"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性" label-width="100px">
      <el-select v-model="model" placeholder="placeholder">
        <el-option label="label" value="value"></el-option>
      </el-select>
      <el-button type="primary"></el-button>
      
      <el-table :data="data" style="width: 100%">
        <el-table-column type="index" label="label" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="label" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="label" width="width">
        </el-table-column>
        <el-table-column prop="prop" label="label" width="width">
        </el-table-column>
      </el-table>
    </el-form-item> 

  </el-form>
</template>

<script>
export default {
  name: '',
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="less" scoped>

</style>
