<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>
    <el-card style="margin-top:20px">
      <!-- spu列表页 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showAddSpuForm">添加SPU</el-button>
        <el-table :data="spuList" style="width: 100%">
          <el-table-column type="index" align="center" label="序号" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <HintButton type="success" icon="el-icon-plus" size="mini" title="添加SKU" @click="showUpdateSkuForm(row)"></HintButton>
              <HintButton type="warning" icon="el-icon-edit" size="mini" title="修改SPU" @click="showUpdateSpuForm(row)"></HintButton>
              <HintButton type="info" icon="el-icon-info" size="mini" title="查看SPU的SKU列表" @click="showSkuList(row)"></HintButton>
              <el-popconfirm :title="`你确定删${row.spuName}吗？`" @onConfirm="deleteSpu(row)">
                <HintButton slot="reference" type="danger" icon="el-icon-delete" size="mini" title="删除SPU"></HintButton>
              </el-popconfirm>
              
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="text-align: center"
          :current-page="page"
          :page-size="limit"
          :total="total"
          :pager-count="5"
          :page-sizes="[2, 4, 6]"
          layout=" prev, pager, next, jumper, ->, sizes, total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      
      <!-- spu的添加和修改页面 -->
      <!-- <SpuForm v-show="isShowSpuForm" :visible="isShowSpuForm" @update:visible="isShowSpuForm = $event"></SpuForm> -->
      <SpuForm 
        v-show="isShowSpuForm" 
        :visible.sync="isShowSpuForm" 
        ref="spu" 
        @backSuccess="backSuccess"
        @cancelSuccess="cancelSuccess"
      >
      </SpuForm>
      
      <!-- sku的添加页面 -->
      <SkuForm v-show="isShowSkuForm" :visible.sync="isShowSkuForm" ref="sku"></SkuForm>
    </el-card>

    <el-dialog
      :title="`${spu.spuName}的sku列表`"
      :visible.sync="dialogVisible"
      :before-close="handlerClose"
      width="witdh">
      <el-table
        v-loading="loading"
        :data="skuList"
        style="width:100%">
        <el-table-column
          prop="skuName"
          label="名称"
          width="width">
        </el-table-column> 
        <el-table-column
          prop="price"
          label="价格"
          width="width">
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量"
          width="width">
        </el-table-column>
        <el-table-column
          prop="prop"
          label="默认图片"
          width="width">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" alt="" style="width:100px;height:100px">
          </template> 
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import SpuForm from '@/views/product/components/SpuForm'
import SkuForm from '@/views/product/components/SkuForm'

export default {
  name: 'Spu',
  components:{
    SpuForm,
    SkuForm
  },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      spuList: [],
      page: 1, 
      limit: 2,
      total: 0,

      isShowList: true,

      isShowSpuForm: false,
      isShowSkuForm: false,

      // sku需要的数据
      dialogVisible: false,

      spu: {},
      skuList: [],
      loading: true,
    }
  },
  methods: {
    handlerCategory({categoryId, level}){
      if(level === 1){
        this.category1Id = categoryId
        // 子组件中心选择1级，清空父组件当中的23级和属性列表
        this.category2Id = ''
        this.category3Id = ''
        this.spuList = []

      } else if(level === 2){
        this.category2Id = categoryId
        this.category3Id = ''
        this.spuList = []

      } else if(level === 3){
        this.category3Id = categoryId
        // 发送请求拿平台属性的列表数据
        this.getSpuList()
      }
    },

    // 获取spu分页列表
    async getSpuList(pager = 1){
      this.page = pager
      let {page, limit, category3Id} = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200){
        this.spuList = result.data.records
        this.total = result.data.total
      }
    },

    // 修改每页数量的回调
    handleSizeChange(size){
      this.limit = size
      this.getSpuList()
    },

    // 点击添加SPU的回调，显示SPU的添加页面
    showAddSpuForm(){
      this.isShowSpuForm = true
      // 通过$refs获取子组件对象，调用子组件里面的方法
      this.$refs.spu.getAddSpuFormInitData(this.category3Id)
    },

    // 点击修改SPU的回调，显示SPU的添加页面
    showUpdateSpuForm(row){
      this.flag = row.id // 这个数据只是为了让返回的时候判断怎么返回的
      this.isShowSpuForm = true
      this.$refs.spu.getUpdateSpuFormInitData(row,this.category3Id)
    },

    // 点击添加SKU的回调，显示SPU的添加页面
    showUpdateSkuForm(row){
      this.isShowSkuForm = true
      this.$refs.sku.getAddSkuFormInitData(row, this.category1Id, this.category2Id)
    },

    // 保存spu成功返回
    backSuccess(){
      // 判断是添加还是修改返回
      if(this.flag){
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.flag = null  // 重置标志位
    },

    // 取消返回的回调
    cancelSuccess(){
      this.flag = null
    },

    // 删除spu
    async deleteSpu(row){
      try {
        await this.$API.spu.remove(row.id)
        this.$message.success('删除spu成功')
        this.getSpuList(this.spuList.length > 1 ? this.page : this.page - 1)
      } catch (error) {
        this.$message.error('删除失败')
      }
    },

    // 点击
    async showSkuList(row){
      this.dialogVisible = true
      this.spu = row
      this.loading = true
      const result = await this.$API.sku.getListBySpuId(row.id)
      if(result.code === 200){
        this.skuList = result.data
      }
      this.loading = false


      // this.$nextTick(() => this.loading = false)
      console.log(1111,result)
      console.log(2222,row)
      console.log(3333,this.skuList)
    },

    // 关闭前在这个函数当中需要手动关闭dialog
    handlerClose(done){
      this.skuList = []
      this.dialogVisible = false
      this.loading = true
    }
  },
  watch:{
    // 通过监视解决三级联动可操作性
    isShowSpuForm:{
      handler(newVal,oldVal){
        this.isShowList = !newVal
      }
    },
    isShowSkuForm(newVal,oldVal){
      this.isShowList = !newVal
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
