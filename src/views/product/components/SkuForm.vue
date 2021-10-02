<template>
  <el-form>
    <el-form-item label="SPU名称" label-width="100px">
      {{ spu.spuName }}
    </el-form-item>

    <el-form-item label="SKU名称" label-width="100px">
      <el-input v-model="skuForm.skuName" placeholder="SKU名称"></el-input>
    </el-form-item>

    <el-form-item label="价格(元)" label-width="100px">
      <el-input v-model="skuForm.price" placeholder="价格(元)" type="number"></el-input>
    </el-form-item>

    <el-form-item label="重量(千克)" label-width="100px">
      <el-input v-model="skuForm.weight" placeholder="重量(千克)"></el-input>
    </el-form-item>

    <el-form-item label="规则描述" label-width="100px">
      <el-input
        v-model="skuForm.skuDesc"
        placeholder="规则描述"
        type="textarea"
        rows="4"
      ></el-input>
    </el-form-item>

    <el-form-item label="平台属性" label-width="100px">
      <el-form :inline="true">
        <el-form-item
          :label="attr.attrName"
          label-width="100px"
          v-for="(attr, index) in attrList"
          :key="attr.id"
        >
          <el-select v-model="attr.attrIdValueId" placeholder="请选择">
            <el-option
              :label="attrValue.valueName"
              :value="`${attr.id}:${attrValue.id}`"
              v-for="(attrValue, index) in attr.attrValueList"
              :key="attrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="销售属性" label-width="100px">
      <el-form :inline="true">
        <el-form-item
          :label="saleAttr.saleAttrName"
          label-width="100px"
          v-for="(saleAttr, index) in spuSaleAttrList"
          :key="saleAttr.id"
        >
          <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="请选择">
            <el-option
              :label="saleAttrValue.saleAttrValueName"
              :value="`${saleAttr.id}:${saleAttrValue.id}`"
              v-for="(saleAttrValue, index) in saleAttr.spuSaleAttrValueList"
              :key="saleAttrValue.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </el-form-item>

    <el-form-item label="图片列表" label-width="100px">
      <el-table :data="spuImageList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="图片" width="width">
          <template slot-scope="{ row, $index }">
            <img :src="row.imgUrl" alt="" style="width:100px;height=100px" />
          </template>
        </el-table-column>
        <el-table-column prop="imgName" label="名称" width="width">
        </el-table-column>
        <el-table-column prop="name" label="操作" width="width">
          <template slot-scope="{ row, $index }">
            <el-button v-if="row.isDefault === '0'" type="primary" size="mini" @click="setDefaultImg(row,spuImageList)">设为默认</el-button>
            <el-tag v-else type="success">默认</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>

    <el-form-item label-width="100px">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'SkuForm',
  data(){
    return {
      spu:{},
      attrList:[],
      spuSaleAttrList: [],
      spuImageList: [], // 请求获取的spu的图片列表，需要在页面展示

      skuImageList:[], // 我们选择了spu的图片列表后组成的sku图片列表，收集到这里

      skuForm: {
        
        // 从父组件传过来的
        spuId: 0,
        category3Id: 0,
        tmId: 0,
        skuDesc: "string",

        // createTime: "2021-09-10T09:20:37.150Z",
        // id: 0,
        // isSale: 0,
        
        // 通过v-model直接收集
        skuName: "",
        price: 0,
        weight: "",

        // 通过自己写代码收集
        skuAttrValueList: [
          // {
          //   attrId: 0, // 需要
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0, // 需要
          //   valueName: "string"
          // }
        ],

        skuDefaultImg: "", // 设置默认图片的路径

        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0
          // }
        ],

        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0, // 需要
          //   saleAttrName: "string",
          //   saleAttrValueId: 0, // 需要
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0
          // }
        ],
      }
    }
  },
  methods:{
    async getAddSkuFormInitData(row,category1Id, category2Id){
      this.spu = row
      // 根据1、2、3级分类获取平台属性列表
      const promise1 =  this.$API.attr.getList(category1Id, category2Id, row.category3Id)
      // 获取指定SPU对应的销售属性列表
      const promise2 =  this.$API.sku.getSpuSaleAttrList(row.id)
      // 根据spu的id对应的图片列表
      const promise3 =  this.$API.sku.getSpuImageList(row.id)

      const result = await Promise.all([promise1, promise2, promise3])
      // result 是promise1,promise2,promise3成功结果的数组
      this.attrList = result[0].data
      this.spuSaleAttrList = result[1].data

      let spuImageList = result[2].data

      spuImageList.forEach(item => item.isDefault = '0')
      this.spuImageList = spuImageList

      console.log(11111,this.attrList)
      console.log(22222,this.spuSaleAttrList)
      console.log(33333,this.spuImageList)
    },

    // 收集sku图片列表的回调
    handleSelectionChange(val){
      console.log(val) // 图片组成的回调列表
      this.skuImageList = val
    },

    // 设置默认图片
    setDefaultImg(row,spuImageList){
      spuImageList.forEach(item => item.isDefault = '0')
      row.isDefault = '1'

      // 此时就是收集默认图片路径的最佳时机
      this.skuForm.skuDefaultImg = row.imgUrl
    },

    // 点击保存操作
    async save(){
      let {spu, skuForm, attrList, spuSaleAttrList,skuImageList } = this
      // 整理参数
      //  父组件传过来的三个
      skuForm.spuId = spu.id
      skuForm.category3Id = spu.category3Id
      skuForm.tmId = spu.id

      //  整理图片列表
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0
      // }
      skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })
      skuForm.skuImageList = skuImageList

      // 整理sku的平台属性值列表和销售属性值列表
      // attrList attrIdValueId
      skuForm.skuAttrValueList = attrList.reduce((prev,item) => {
        //判断哪个平台属性当年被选择过属性
        if(item.attrIdValueId){
          // 把收集的数据转化为需要的属性值结构
          let [attrId, valueId] = item.attrIdValueId.split(':')
          let obj = {attrId, valueId}
          prev.push(obj)
        }
        return prev
      },[])

     // 销售属性
     // spuSaleAttrList  saleAttrIdValueId
     skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev,item) => {
        //判断哪个平台属性当年被选择过属性
        if(item.saleAttrIdValueId){
          // 把收集的数据转化为需要的属性值结构
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(':')
          let obj = {saleAttrId, saleAttrValueId}
          prev.push(obj)
        }
        return prev
      },[])

      // 发请求
      try {
        await this.$API.sku.addUpdate(skuForm)
        this.$message.success('保存sku成功')
        this.$emit('update:visible', false)
        this.resetData()
      } catch (error) {
        this.$message.success('保存失败')
      } 
    },

    // 取消操作
    cancel(){
      this.$emit('update:visible', false)
      this.resetData()
    },

    // 清空data数据
    resetData(){
      this.spu ={}
      this.attrList =[]
      this.spuSaleAttrList = []
      this.spuImageList = []
      this.skuImageList =[]
      this.skuForm = {
        spuId: 0,
        category3Id: 0,
        tmId: 0,
        skuDesc: "string",
        skuName: "",
        price: 0,
        weight: "",
        skuAttrValueList: [],
        skuDefaultImg: "",
        skuImageList: [],
        skuSaleAttrValueList: [],
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
