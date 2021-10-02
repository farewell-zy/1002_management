<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog"
      >添加</el-button
    >
    <!--
      el-table代表表格，表格当中是一列一列的
      data="data"这个属性用来展示数据的，但我们现在还没数据
        表格展示展示数据的时候，数据格式必须是数组，数组内部是对象
      border代表是否需要边框
      align="center"列中的数据居中
     -->
    <!-- 
      table当中:data="tardemarkList"，代表的是表格要展示的数组
      当我们写上这个的时候，table会把这个数组给每个列传递一份
      每个列的内部都是在展示我们这个数组的数据v-for
      每个列在展示数据的时候，结构是由自己说的算 
      table列内部是由作用域插槽的

      table的列在展示数据的时候，如果我们的数据就是要展示的数据，那么直接鞋ppro就行
      如果我们的数据不是直接展示的数据，而是需要其他结构，那么必须使用作用域插槽
    -->
    <el-table :data="trademarkList" border style="width: 100%; margin: 20px 0">
      <!-- prop目前不用，后期需要展示数据当中的某个属性使用
      label代表这一列的名称
      width代表这一列的宽度，直接写数字 不需要px 如果不写，那么这些列平分 -->
      <el-table-column type="index" label="序号" align="center" width="80">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌logo" width="width">
        <template slot-scope="{ row, $index }">
          <!-- row代表当前遍历的对象
          $index代表当前遍历对象的下标 -->
          <img :src="row.logoUrl" alt="" style="height: 60px; width: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="width">
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="showUpdataDialog(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTrademark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页器
    :current-page   传递的当前页码
    :page-size      传递的每页数量
    :total          传递的总数
    :pager-count    传递的连续页数，如果写的是5，连续数是3  5包含首页和尾页
    @current-change 切换页面的事件

    :page-sizes     在页面可以改变当前页的数量
    @size-change    改变当前页数量的事件
    
    layout          可以改变分液器前后顺序(布局顺序) -->
    <el-pagination
      background
      style="text-align: center"
      :current-page="page"
      :page-size="limit"
      :total="total"
      :pager-count="5"
      :page-sizes="[3, 5, 10]"
      layout=" prev, pager, next, jumper, ->, sizes, total"
      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
    >
    </el-pagination>

    <!-- 点击添加或点击修改弹出的对话框页面
    写静态页面的时候把东西复制过来，先把内部所有的动态数据删掉 -->
    <el-dialog
      :title="tmFrom.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
    >
      <el-form style="width: 80%" :model="tmFrom" :rules="rules" ref="tmFrom">
        <!-- el-form代表的是表单
        表单里面是表单项，
          每个表单都可以通过label-width设置表单项名称的宽度
          每个表单项都可以通过label设置表单项名称
        from当中都会写:model="对象" 作用：1、以后用来对这个from表单验证 2、用来标识收集这个from收集的数据收集到哪 
        -->
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input autocomplete="off" v-model="tmFrom.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px" prop="logoUrl">
          <!-- action控制的是上传的接口地址 -->
          <!-- 上传图片分为两步：我们上传的时候需要调用接口，把本地的图片传到后端服务器
          接下来，后端服务器会给我们返回这个图片再后端服务器上的地址
          我们要收集的东西就是返回来的这个路径 -->
          <!-- 上传的接口前面必须添加${baseURL} -->

          <!--  
            :show-file-list="false"             代表显示的只有一张图片，不是多个(照片墙) 
            :on-success="handleAvatarSuccess"   代表图片上传成功的回调
            :before-upload="beforeAvatarUpload" 代表图片上传前的回调
          -->
          <el-upload
            class="avatar-uploader"
            :action="`${baseURL}/admin/product/fileUpload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmFrom.logoUrl" :src="tmFrom.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div class="el-upload__tip" slot="tip">
              只能上传jpg文件，且不超过2M
            </div>
          </el-upload>
        </el-form-item>

        <!-- <el-form-item label="活动区域">
          <el-select value="" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdataTrademark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Trademark",
  data() {
    var validateTmName = (rule, value, callback) =>{
      // value就是后期要验证的用户输入的数据
      // callback是一个回调函数，如果callback调用的时候传递了参数，代表验证失败，如果没有，代表验证成功
      if (value.length < 2 || value.length > 20) {
        callback(new Error('tmName长度必须是2-20之间'))
      } else {
        callback()
      }
    };

    return {
      // 上传服务器地址前缀
      baseURL: process.env.VUE_APP_BASE_API,

      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,

      dialogFormVisible: false, // 这个数据决定dialog是否显示

      // imageUrl: '', // upload内部的数据有可能不用

      // tmFrom就是我们收集成功的那个品牌对象
      tmFrom: {
        tmName: "", // 收集我们的品牌名称
        logoUrl: "", // 收集我们的品牌图片的logo路径
      }, // 用来收集数据的

      rules: {
        // 规则
        // 每个要验证的字段规则都是一个数组
        // 数组里面是对象，每一个对象就代表一个验证规则
        // 每个规则对象里面包含三个东西：1、规则 2、错误提示信息 3、触发时机(验证时机)
        // 触发时机：一共有三个   1、失去焦点blur 2、内容改变的时候change 整体验证的时候
        tmName: [
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // {
          //   min: 2,
          //   max: 10,
          //   message: "长度在 2 到 10 个字符",
          //   trigger: "change",
          // },
          { validator: validateTmName, trigger: "change" } // 自定义验证规则
        ],
        logoUrl: [
          { required: true, message: "请上传图片" }, // 这个触发是在整体验证时触发
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    // vm创建及切换页的回调
    async getTrademarkList(page = 1) {
      this.page = page;
      const result = await this.$API.trademark.getPageList(
        this.page,
        this.limit
      );
      if (result.code === 200) {
        this.trademarkList = result.data.records;
        this.total = result.data.total;
      }
    },

    // 这个是切换分页器页码的回调
    // handleCurrentChange(page){
    //   this.page = page
    //   this.getTrademarkList()
    // },

    // 这个是切换每页数量的回调，不能省去
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },

    // upload组件当中的两个函数
    handleAvatarSuccess(res, file) {
      // res   上传成功后返回的响应数据
      // file  代表上传成功的图片文件本身

      // 本身写的东西，这个是错的，它也是收集上传成功的路径，但是这样写是错的
      // 它最终收集的是本地的路径，是错的，我们要的是上传成功后服务器返回来的线上路径
      // this.imageUrl = URL.createObjectURL(file.raw);
      this.tmFrom.logoUrl = res.data; // 或者是file.response.data
    },

    // 图片上传之前的回调
    // 就是上传的时候可以限制图片的格式大小
    beforeAvatarUpload(file) {
      // 代表你上传的图片
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },

    // 点击添加品牌弹出添加品牌的dialog对话框
    showAddDialog() {
      this.dialogFormVisible = true;
      // 把tmFrom内的数据清空，如果不清空，添加数据点取消，再添加数据还存在
      this.tmFrom = {
        tmName: "",
        logoUrl: "",
      };
    },

    // 点击修改弹出修改品牌的dialog对话框
    showUpdataDialog(row) {
      this.dialogFormVisible = true;
      // row代表的就是修改的那一行，就是要修改的品牌对象
      // this.tmFrom = row // 这样不行，存在bug，直接改了原来的内容
      // 我们这里row当中只有基本数据类型，所以说我们浅拷贝就ok，就没必要深拷贝，深拷贝也可以
      this.tmFrom = { ...row }; // 最简单的浅拷贝对象
      // var a = [1,2,3]  var b = a 不是拷贝
      // 拷贝必须出现另一个内存空间
      // 深浅拷贝 说的是拷贝过程中数据的类型问题
      // 深浅拷贝面向的数据必然是对象格式，基本数据类型，不存在深浅拷贝
      //   浅拷贝：对象当中所有的对象数据在拷贝给另一个内存的时候，拷贝地址
      //   深拷贝：对象当中所有的对象数据在拷贝给另一个内容的时候，拷贝数据而不是地址
      // tmFrom = {
      //   tmName: 'aa',
      //   logoUrl: 'bb',
      //   data:[1,2,3] //0x100
      // }
      // // 如果是浅拷贝
      // tmFromCopy = {
      //   tmName: 'aa',
      //   logoUrl: 'bb',
      //   data:[1,2,3] //0x100
      // }
      // // 如果是深拷贝
      // tmFromDeepCopy = {
      //   tmName: 'aa',
      //   logoUrl: 'bb',
      //   data:[1,2,3] //0x200
      // }
    },

    // 点击确定按钮发送请求添加或者修改品牌
    addOrUpdataTrademark() {
      // 整体验证
      this.$refs.tmFrom.validate(async (valid) => {
        if (valid) {
          // 获取参数
          let trademark = this.tmFrom; // tmForm就是咱们添加或者修改最终收集到的品牌数据
          // 整理参数 一般是我们的参数数据不符合请求的参数格式，那么需要整理
          // 发请求
          try {
            await this.$API.trademark.addOrUpdata(trademark);
            // 1、提示
            this.$message.success(
              trademark.id ? "修改品牌成功" : "添加品牌成功"
            );
            // 2、关闭dialog，回到列表页
            this.dialogFormVisible = false;
            // 3、重新发送请求获取列表页数据
            this.getTrademarkList(trademark.id ? this.page : 1); // 添加返回第一页，修改保持当前页
            // 添加显示添加项所在页，下面这个存在问题页码不会改变
            // if(this.trademarkList.length === 3 && this.page === Math.ceil(this.total/this.limit)){
            //   this.page = this.page + 1
            // }
            // this.getTrademarkList(this.page)
          } catch (error) {
            this.$message.error(trademark.id ? "修改品牌失败" : "添加品牌失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 点击删除按钮，删除对应的品牌
    deleteTrademark(row) {
      this.$confirm(`你确定要删除${row.tmName}吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await this.$API.trademark.delete(row.id);
            this.$message.success("删除品牌成功"); // 简写
            // this.$message({
            //   type: 'success',
            //   message: '删除成功!'
            // });
            // 删除哪个数据回到的还是哪个数据所在的页面
            // 假设删除数据的那一页只有一条数据，我们需要回到前一页，而不是数据当前页
            this.getTrademarkList(
              this.trademarkList.length > 1 ? this.page : this.page - 1
            );
          } catch (error) {
            this.$message.error("删除品牌失败");
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

