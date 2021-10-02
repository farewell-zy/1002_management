<template>
  <el-card class="container">
    <el-button type="primary">添加角色</el-button>

    <el-table
      v-loading="loading"
      :data="roleList"
      border
      class="container-table"
    >
      <el-table-column width="50" type="selection" align="center" />
      <el-table-column label="序号" width="50" type="index" align="center" />

      <el-table-column prop="roleName" label="角色名称" />
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="
              $router.push({
                name: 'RoleAuth',
                params: {
                  roleId: row.id
                },
                query: {
                  roleName: row.roleName
                }
              })
            "
          >
            分配权限
          </el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[3, 6, 9, 12]"
      :page-size="pageSize"
      layout="prev, pager, next, jumper, total, sizes"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </el-card>
</template>

<script>
export default {
  name: 'Role',
  data() {
    return {
      loading: false,
      roleList: [{}],
      currentPage: 1,
      pageSize: 3,
      total: 0
    }
  },
  mounted() {
    this.getRoleList(this.currentPage, this.pageSize)
  },
  methods: {
    async getRoleList(currentPage, pageSize) {
      const res = await this.$API.role.reqGetRoleList({
        page: currentPage,
        limit: pageSize
      })
      this.roleList = res.items
      this.total = res.total
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.getRoleList(this.currentPage, pageSize)
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
      this.getRoleList(currentPage, this.pageSize)
    }
  }
}
</script>

<style></style>
