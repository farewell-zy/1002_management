<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
        <el-input placeholder="用户名" />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search">查询</el-button>
      <el-button type="default">清空</el-button>
    </el-form>

    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="showUserRole">添 加</el-button>
      <el-button
        type="danger"
        >批量删除</el-button
      >
    </div>

    <el-table
      border
      stripe
      :data="users"
    >
      <el-table-column type="selection" width="50" />

      <el-table-column type="index" label="序号" width="50" align="center" />

      <el-table-column label="用户名" width="80" />
      <el-table-column label="用户昵称" width="80" />
      <el-table-column label="权限列表" />

      <el-table-column label="创建时间" width="155" />
      <el-table-column label="更新时间" width="155" />

      <el-table-column label="操作" width="200" align="center">
        <template>
          <el-button
            type="info"
            size="mini"
            icon="el-icon-user-solid"
             @click="showAssignRole"
            title="分配角色"
          />
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            title="修改用户"
          />
          <el-popconfirm
            :title="`确定删除xxx吗?`"
          >
            <el-button
              style="margin-left: 10px"
              type="danger"
              size="mini"
              icon="el-icon-delete"
              title="删除用户"
            />
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 20px 0"
      layout="prev, pager, next, jumper, ->, sizes, total"
      @current-change="getUsers"
      @size-change="handleSizeChange"
    />
    <!-- 添加用户的弹窗 -->
 <el-dialog
      :title="user.id ? '修改用户' : '添加用户'"
      :visible.sync="dialogUserVisible"
    >
      <el-form
        label-width="120px"
      >
        <el-form-item label="用户名">
          <el-input />
        </el-form-item>
        <el-form-item label="用户昵称">
          <el-input />
        </el-form-item>

        <el-form-item label="用户密码">
           <!-- v-if="!user.id"y -->
         <el-input />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <el-dialog
      title="设置角色"
      :visible.sync="dialogRoleVisible"
      :before-close="resetRoleData"
    >
      <el-form label-width="80px">
        <el-form-item label="用户名">
          <el-input disabled></el-input>
        </el-form-item>

        <el-form-item label="角色列表">
          <el-checkbox
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group
          >
            <el-checkbox
              label="123"
              >块垒</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer">
        <el-button type="primary">保存</el-button
        >
        <el-button>取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'AclUserList',

  data() {
    return {
      searchObj: {
        // 包含请求搜索条件数据的对象
        username: ''
      },
      tempSearchObj: {
        // 收集搜索条件输入的对象
        username: ''
      },
      selectedIds: [], // 所有选择的user的id的数组
      users: [{}], // 当前页的用户列表
      page: 1, // 当前页码
      limit: 5, // 每页数量
      total: 0, // 总数量
      user: {}, // 当前要操作的user
      dialogUserVisible: false, // 是否显示用户添加/修改的dialog
      dialogRoleVisible: false, // 是否显示角色Dialog
      allRoles: [], // 所有角色列表
      userRoleIds: [], // 用户的角色ID的列表
      isIndeterminate: false, // 是否是不确定的
      checkAll: false // 是否全选
    }
  },
  methods: {
    /*
    显示指定角色的界面
    */
    showAssignRole() {
      this.dialogRoleVisible = true
    },
    showUserRole() {
      this.dialogUserVisible = true
    },

    // 获取分页列表
    getUsers() {},

    // 处理pageSize发生改变的监听回调
    handleSizeChange() {},
  }
}
</script>
