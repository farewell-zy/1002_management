<template>
  <div>
    <!-- 三级联动 -->
    <el-card>
      <CategorySelector @handlerCategory="handlerCategory" :isShowList="isShowList"></CategorySelector>
    </el-card>

    
    <el-card style="margin-top:20px">
      <!-- 属性列表 -->
      <div v-show="isShowList">
        <el-button type="primary" icon="el-icon-plus" @click="showAddDiv" :disabled="!category3Id">添加属性</el-button>
        <el-table
          :data="attrList" 
          border
          style="width: 100%">
          <el-table-column
            type="index"
            align="center"
            label="序号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值列表" width="width">
            <!-- 展示属性值列表的时候需要遍历v-for，而且每个属性值外部有结构，所以也得用作用域插槽 -->
            <template slot-scope="{ row, $index }">
              <!-- row代表当前遍历的这个属性 row.attrValueList才是你要自己遍历展示的属性值列表 -->
              <el-tag 
                type="success" 
                v-for="(attrValue, index) in row.attrValueList" :key="attrValue.id"
              >{{ attrValue.valueName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <HintButton type="warning" icon="el-icon-edit" title="修改" size="mini" @click="showUpdataDiv(row)"></HintButton>
              <el-popconfirm :title="`你确定要删除${row.attrName}吗?`" @onConfirm="deleteAttr(row)">
                <!-- onConfirm点击气泡确认的框的确定按钮，触发的事件，官网是错的 -->
                <HintButton slot="reference" type="danger" icon="el-icon-delete" title="删除属性值" size="mini"></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加或修改页面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrFrom">
          <el-form-item label="属性名">
            <el-input placeholder="请输入属性名" v-model="attrFrom.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrFrom.attrName">添加属性值</el-button>
        <el-button @click="isShowList = true">取消</el-button>

        <!-- 收集属性值的时候，用了一个占位的思想，先往数组里面添加一个属性值对象，指不定属性值的名称此时是空的
        但是,一旦添加这个属性值对象,表哥当中都会出现一行,我们可以输入框再去给添加的属性对象,收集名称 -->
        <el-table border style="width: 100%; margin: 20px 0" :data="attrFrom.attrValueList">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="{row, $index}">
              <el-input
                :ref="$index"
                size="mini" 
                v-if="row.isEdit" 
                v-model="row.valueName" 
                placeholder="请输入属性值名称"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"></el-input>
              <span v-else @click="toEdit(row, $index)" style="display:block;width:100%;height:100%">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`你确定要删除${row.valueName}这个属性值吗?`" @onConfirm="attrFrom.attrValueList.splice($index, 1)">
                <!-- onConfirm点击气泡确认的框的确定按钮，触发的事件，官网是错的 -->
                <HintButton slot="reference" type="danger" icon="el-icon-delete" title="删除属性值" size="mini"></HintButton>
              </el-popconfirm>
              <HintButton type="warning" icon="el-icon-edit" title="修改属性值" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary" @click="save" :disabled="attrFrom.attrValueList.length === 0">保存</el-button>
        <el-button @click="isShowList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],

      isShowList: true,

      attrFrom:{
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: ""
          // }
        ],
        // categoryId: this.category3Id, // 这样写是错误的
        // data当中不能使用this，因为data是个对象，初始化的时候谁先谁后不一定
        categoryId: 0,
        categoryLevel: 3,
        // id: 0
      }
    }
  },
  methods: {
    handlerCategory({categoryId, level}){
      if(level === 1){
        this.category1Id = categoryId
        // 子组件中心选择1级，清空父组件当中的23级和属性列表
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []

      } else if(level === 2){
        this.category2Id = categoryId
        this.category3Id = ''
        this.attrList = []

      } else if(level === 3){
        this.category3Id = categoryId
        // 发送请求拿平台属性的列表数据
        this.getAttrList()
      }
    },
    // 请求获取属性的列表数据
    async getAttrList(){
      let {category1Id,category2Id,category3Id} = this
      const result = await this.$API.attr.getList(category1Id,category2Id,category3Id)
      if(result.code === 200){
        this.attrList = result.data
      }
    },

    // 点击添加按钮显示添加的页面
    showAddDiv(){
      this.isShowList = false
      this.attrFrom = {
        attrName: "",
        attrValueList: [
          // {
          //   attrId: 0,
          //   id: 0,
          //   valueName: ""
          // }
        ],
        categoryId: this.category3Id, // 收集的属性内部是三级id
        categoryLevel: 3,
        // id: 0
      }
    },

    // 点击添加属性值
    addAttrValue(){
      this.attrFrom.attrValueList.push({
        attrId: this.attrFrom.id, // 这个id代表属性值所属属性的id 有就是修改页面 没有就是添加页面
        // id: 0,// 新添加属性值没id
        valueName: "", // 一会需要
        isEdit: true // 这个属性值标识着这个属性值的模式是编辑模式
      });

      // 让新添加的这个自动获取焦点
      this.$nextTick(() => {
        this.$refs[this.attrFrom.attrValueList.length - 1].focus()
      })
    },

    // 点击修改属性按钮显示修改属性的页面
    showUpdataDiv(row){
      this.isShowList = false
      // this.attrFrom = {...row} // 这次这里是使用浅拷贝，没办法，因为内部数组是一个对象类型，浅拷贝拷的还是地址，数组用的同一个
      this.attrFrom = cloneDeep(row) // 深拷贝
      // 这里代表修改属性，修改属性的时候，属性当中已经存在了一些属性值，这些属性值我们也添加模式
      // this.attrFrom.attrValueList.forEach(item => item.isEdit = false)
      // item.isEdit = false给每个属性值添加属性，不是响应式属性
      // vue当中对数据进行数据监视的时候，只是一开始对数据里面的属性做了响应式
      this.attrFrom.attrValueList.forEach(item => this.$set(item, 'isEdit', false))
    },

    // 对input失去焦点或者回车，那么切换查看模式
    toLook(row){
      // 失去焦点的时候需要判定数据中是否有属性值名称
      if(row.valueName.trim() === ''){
        row.valueName = ''
        return
      }

      let isRepeat = this.attrFrom.attrValueList.some(item => {
        if(item !== row){
          return item.valueName === row.valueName
        }
      })

      if(isRepeat){
        this.$message.info('输入的属性值名称不能重复')
        row.valueName = ''
        return
      }

      row.isEdit = false
    },

    // 对span进行点击的时候，切换为编辑模式
    toEdit(row, index){
      row.isEdit = true

      // 从span变为input需要自动获取焦点
      // 直接写这一行，input其实还没有创建成功，所以报错，this.$refs[index]是undefind
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 保存操作
    async save(){
      // 1、获取参数
      let attr = this.attrFrom
      // 2、整理参数
      //   属性值名称为空，从属性值列表当中去除
      //   属性值去除isEdit属性 isEdit使我们后面自己添加用来标识查看模式和编辑模式的
      attr.attrValueList = attr.attrValueList.filter(item => {
        // if(item.valueName !== ''){
        if(item.valueName.trim() !== ''){
          delete item.isEdit
          return true
        }
      })
      // attr.attrValueList = attr.attrValueList.filter(item => {
      //   delete item.isEdit
      //   return item.valueName.trim() !== ''
      // })
      //   属性值列表如果没有属性值，不发请求
      if(attr.attrValueList.length === 0){
        this.$message.info('属性值列表必须有属性值才能保存')
        return
      }
      // 3、发请求
      try {
        // 4、成功干啥
        await this.$API.attr.addOrUpdata(attr)
        this.$message.success('保存属性值成功')
        this.isShowList = true
        this.getAttrList()
      } catch (error) {
        // 5、失败干啥
        this.$message.error('保存属性失败' + error.message)
      }
    },

    // 删除属性操作
    async deleteAttr(row){
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('删除属性成功')
        this.getAttrList()
      } catch {
        this.$message.error('删除属性失败')
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>
