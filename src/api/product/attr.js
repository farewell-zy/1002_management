// 这个文件里面是和属性相关的接口请求函数
import request from '@/utils/request'

export default {
  // 属性的增删改查接口
  // 根据选中的123级分类id获取属性列表
  // Get  /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
  getList(category1Id, category2Id, category3Id){
    return request.get(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },

  // DELETE /admin/product/deleteAttr/{attrId}
  delete(attrId){
    return request.delete(`/admin/product/deleteAttr/${attrId}`)
  },


  // post /admin/product/saveAttrInfo 
  addOrUpdata(attr){
    return request.post('/admin/product/saveAttrInfo',attr)
  },

  

  // {
  //   "attrName": "string",
  //   "attrValueList": [
  //     {
  //       "attrId": 0,
  //       "id": 0,
  //       "valueName": "string"
  //     }
  //   ],
  //   "categoryId": 0,
  //   "categoryLevel": 0,
  //   "id": 0
  // }
}