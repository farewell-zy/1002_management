<template>
  <el-form :model="spuForm">
    <el-form-item label="SPU名称" label-width="100px">
      <el-input v-model="spuForm.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>

    <el-form-item label="品牌" label-width="100px">
      <el-select v-model="spuForm.tmId" placeholder="请选择品牌">
        <el-option :label="tm.tmName" :value="tm.id" v-for="tm in trademarkList" :key="tm.id"></el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述" label-width="100px">
      <el-input placeholder="SPU描述" type="textarea" v-model="spuForm.description" rows="4"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片" label-width="100px">
        <!-- :file-list="fileList" 指定我们图片展示的数组 -->
      <el-upload
        :action="`${baseURL}/admin/product/fileUpload`"
        list-type="picture-card"
        :file-list="spuImageList"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handlePictureSuccess">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item label="销售属性" label-width="100px">
      <el-select v-model="unUseSaleAttrIdName" :placeholder="unUseSaleAttrList.length > 0?`还有${unUseSaleAttrList.length}未选择` : '没有了'">
        <el-option 
          :label="unUseSaleAttr.name" 
          :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`" 
          v-for="unUseSaleAttr in unUseSaleAttrList" 
          :key="unUseSaleAttr.id"
        >
        </el-option>
      </el-select>
      <el-button type="primary" icon="er-icon-plus" @click="addSaleAttr" :disabled="!unUseSaleAttrIdName">添加销售属性</el-button>

      <el-table border style="width: 100%" :data="spuForm.spuSaleAttrList">
        <el-table-column type="index" align="center" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="saleAttrName" label="属性名" width="150">
        </el-table-column>
        <el-table-column prop="prop" label="属性值名称列表" width="width">
          <template slot-scope="{row, $index}">
            <!-- closable  后面的X
            :disable-transitions="false" 是否禁用过渡
            @close="handleClose(saleAttrValue)" 点击X的回调-->
            <el-tag
              closable
              :disable-transitions="false"
              v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
              :key="saleAttrValue.id"
              @close="row.spuSaleAttrValueList.splice(index,1)"
            >
              {{saleAttrValue.saleAttrValueName}}
            </el-tag>

            
            <!-- @keyup.enter.native="handleInputConfirm" 编辑查看模式
            @blur="handleInputConfirm" -->
            <el-input
              class="input-new-tag"
              v-if="row.inputVisible"
              v-model="row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            >
            </el-input>

            <el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加SKU</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="prop" label="操作" width="150">
          <template slot-scope="{row, $index}">
            <HintButton 
              type="danger" 
              icon="el-icon-delete" 
              size="mini" 
              title="删除销售属性"
              @click="spuForm.spuSaleAttrList.splice($index, 1)"
            ></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item  label-width="100px">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
export default {
  name: 'SpuForm',
  props: ['visible'],
  data() {
    return {
      // 上传服务器地址前缀
      baseURL: process.env.VUE_APP_BASE_API,
      // 和upload相关的动态数据
      dialogImageUrl: "",
      dialogVisible: false,

      
      category3Id:"",
      // 请求初始化spu详情数据，这个spuForm也是后面添加要收集的对象，内部和修改请求回来的数据结构是一样的
      // 这个spuForm我们颞部初始化属性都是空的，视为添加spu收集数据用的
      // 修改spu的时候，这个spuFrom就会被赋值为请求回来的数据的对象
      spuForm: {
        category3Id: "",
        description: "",
        // "id": 0, // 初始化的时候，添加是没有id的
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0
          // }
        ],
        spuName: "",
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: "",
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: "string",
          //       saleAttrName: "string",
          //       saleAttrValueName: "string",
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmId: "",
      }, 
      
      spuImageList: [], // 请求初始化的spu图片
      trademarkList: [], // 请求初始化的所有品牌列表
      saleAttrList: [], // 请求初始化的所有的销售属性列表

      unUseSaleAttrIdName: "", // 自己认为的收集的未选择使用的销售属性Id和Name
    };
  },
  methods: {
    // 和upload相关的回调函数
    // 删除图片成功后的回调
    handleRemove(file, fileList) {
      // 删除图片的时候我们需要收集新的图片列表
      this.spuImageList = fileList
      console.log(file, fileList);
    },

    // 这个方法代表上传成功的回调
    handlePictureSuccess(res, file, fileList){
      // 上传成功，也需要把最后的图片列表收集起来
      // this.supImageList = fileList
      this.spuImageList = fileList
    },

    // 这个方法是预览大图使用，已经写好了不用动
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url; // 把需要放大的图片src赋值到对话框当中的图片
      this.dialogVisible = true; // 弹出放大图片对话框
    },

    // 请求获取修改spu的初始化数据
    async getUpdateSpuFormInitData(spu,category3Id){
      this.category3Id = category3Id
      // 发4个请求
      // 根据spu的id获取spu的详情
      // /admin/product/getSpuById/4
      const result = await this.$API.spu.get(spu.id)
      if(result.code === 200){
        this.spuForm = result.data
      }

      // 根据spu的id获取spu的图片列表
      // /admin/product/spuImageList/4
      const imageResult = await this.$API.sku.getSpuImageList(spu.id)
      if(imageResult.code === 200){
        // 我们为了让upload可以展示图片列表，必须把请求回来的图片当中添加上name,url
        let spuImageList = imageResult.data
        spuImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = spuImageList
      }

      // 获取所有的品牌列表
      // /admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList()
      if(trademarkResult.code === 200){
        this.trademarkList = trademarkResult.data
      }


      // 获取所有的销售属性列表
      // /admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if(saleAttrResult.code === 200){
        this.saleAttrList = saleAttrResult.data
      }
    },

    // 请求获取添加spu的初始化数据
    async getAddSpuFormInitData(category3Id){
      this.category3Id = category3Id
      // 发2个请求
      // 获取所有的品牌列表
      // /admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList()
      if(trademarkResult.code === 200){
        this.trademarkList = trademarkResult.data
      }


      // 获取所有的销售属性列表
      // /admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if(saleAttrResult.code === 200){
        this.saleAttrList = saleAttrResult.data
      }
    },

    // 点击添加销售属性
    addSaleAttr(){
      let [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(':');
      // 把收集到的数据添加到对象
      let obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }
      this.spuForm.spuSaleAttrList.push(obj)
      // 清空收集的数据
      this.unUseSaleAttrIdName = ''
    },

    // 点击销售属性值列表的添加按钮
    showInput(row){
      // row.inputVisible = true
      this.$set(row, 'inputVisible', true)

      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },

    // 当用户输入销售属性值完成后失去焦点或者回车的回调
    handleInputConfirm(row){
      let saleAttrValueName = row.inputValue
      let baseSaleAttrId = row.baseSaleAttrId

      // 拿到属性值名称，判断是否是空串
      if(saleAttrValueName.trim() === ''){
        row.inputValue = ''
        return
      }

      // 判断当前这个销售属性值名称是否已经在销售属性值列表当中存在，这里不需要除去自身
      // 因为我们现在还没把这个销售属性值添加到指定的位置
      // 之前平台属性要除去自身，因为平台属性用占位思想，还没有输入平台属性
      let isRepeat = row.spuSaleAttrValueList.some(item => item.saleAttrValueName === saleAttrValueName)
      if(isRepeat){
        this.$message.info('销售属性值名称不能重复')
        row.inputValue = ''
        return
      }

      // 销售属性值名称没问题，我们就构造成我们需要的销售属性值对象
      let obj = {
        saleAttrValueName,
        baseSaleAttrId
      }

      row.spuSaleAttrValueList.push(obj) // 把销售属性值添加到指定的销售属性值列表
      // 把input再变为按钮
      row.inputVisible = false
      // 将input当中的值清空
      row.inputValue = ''
    },

    // 添加spu或修改spu点击保存操作
    async save(){
      // 1、获取参数数据
      let {spuForm, spuImageList, category3Id} = this

      // 2、整理参数
      //    整理category3Id
      spuForm.category3Id = category3Id

      //    整理图片列表
      //      包含之前已经有的和自己最近上传的
      //      之前已经有的图片内部是有imgName和imgUrl，他也有name和url，而自己的只有name和url
      spuImageList = spuImageList.map(item => {
        return {
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data // 自己新上传的图片路径
        }
      })

      spuForm.spuImageList = spuImageList
      //      整理销售属性，要去除销售属性不需要的
      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputVisible
        delete item.inputValue
      })
      console.log(22222,spuForm)
      // 3、发请求
      try{
        // 成功
        await this.$API.spu.addUpdate(spuForm)
        this.$message.success('保存成功')
        //  返回列表页
        this.$emit('update:visible', false)
        //  通知返回列表页成功，在列表页重新获取请求
        this.$emit('backSuccess')
        //  返回成功后情况当前spuform数据
        this.resetData()
      } catch (error){
        this.$message.error('保存spu失败')
      }
    },

    // 重置data数据
    resetData(){
      this.dialogImageUrl = ""
      this.dialogVisible = false  
      this.category3Id = ""
      this.spuForm = {
          category3Id: "",
          description: "",
          spuImageList: [],
          spuName: "",
          spuSaleAttrList: [],
          tmId: "",
        }  
      this.spuImageList = []
      this.trademarkList = []
      this.saleAttrList = []
      this.unUseSaleAttrIdName = ""
    },

    // 返回列表项
    cancel(){
      // 返回列表项
      this.$emit('update:visible', false)
      // 通知父组件回来了
      this.$emit('cancelSuccess')
      // 清空数据
      this.resetData()
    }
  },

  computed:{
    // 根据请求获取的所有的销售属性列表和spu详情当中自己的销售属性列表 计算得到未选择的销售属性列表
    // saleAttrList      spuForm.spuSaleAttrList
    unUseSaleAttrList(){
      // 从所有的销售属性列表中过滤不在spu自己的销售属性列表当中的 所有销售属性
      // return this.saleAttrList.filter(saleAttr => {
      //   return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
      //     return spuSaleAttr.saleAttrValueName !== saleAttr.name
      //   })
      // })

      return this.saleAttrList.filter(
        saleAttr => this.spuForm.spuSaleAttrList.every(
          spuSaleAttr => spuSaleAttr.saleAttrName !== saleAttr.name
        )
      )
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>