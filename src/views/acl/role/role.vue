<template>
  <el-card class="container">
    <el-table
      :data="permissionList"
      row-key="id"
      border
      :expand-row-keys="['1']"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="名称" sortable width="180" />
      <el-table-column label="权限值" sortable width="180" />
      <el-table-column label="跳转权限值" />
      <el-table-column label="操作">
        <template>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-plus"
          />
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-edit"
            @click="isShowVisible"
          />
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          />
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="title" :visible.sync="visible">
      <!-- body -->
      <el-form label-width="110px">
        <el-form-item label="父级名称">
          <el-input disabled />
        </el-form-item>
        <el-form-item label="名称">
          <el-input />
        </el-form-item>
        <el-form-item label="功能权限值">
          <el-input />
        </el-form-item>
        <el-form-item label="跳转路由权限值">
          <el-input />
        </el-form-item>
      </el-form>
      <!-- footer -->
      <span class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">
          确 定
        </el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  name: 'Permission',
  data() {
    return {
      permissionList: [{}],
      visible: false,
    }
  },
  methods:{
    isShowVisible(){
      this.visible = true
    }
  }
}
</script>

<style></style>
