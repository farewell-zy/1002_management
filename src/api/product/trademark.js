// 这个文件里面是和品牌相关的接口请求函数
import request from '@/utils/request'

export default {
  // 每一个接口请求函数

  // DELETE /admin/product/baseTrademark/remove/{id}
  // 根据品牌id删除某个品牌
  delete(id){
    // axios的对象写法 
    // 第一个参数永远是路径
    // 第二个参数要看请求方式
    //   如果是post和put请求，第二个参数是请求体参数(一个对象data),第三个参数是一个配置对象(一般不写)
    //   如果是其他的请求，第二个参数是一个配置对象(一般不写)
    return request.delete(`/admin/product/baseTrademark/remove/${id}`)
  },

  // post /admin/product/baseTrademark/save
  // 新增一个品牌
  // put /admin/product/baseTrademark/update
  // 修改一个品牌
  // 无论是增还是改，都需要一个请求体参数，这个参数就是品牌对象
  // 但是这两个请求方式，所传递的品牌对象是不一样的，如果是新增品牌对象里面没有id，如果是修改，品牌对象里面有id
  addOrUpdata(trademark){
    if(trademark.id){
      // 如果id存在证明是修改
      return request.put('/admin/product/baseTrademark/update', trademark)
    }else{
      return request.post('/admin/product/baseTrademark/save', trademark)
    }
  },

  // get /admin/product/baseTrademark/{page}/{limit}
  // 查询品牌的分页列表数据
  getPageList(page, limit){
    return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
  },
 
  // get /admin/product/baseTrademark/getTrademarkList 
  // 获取所有品牌列表，而不是分页列表
  getList(){
    return request.get('/admin/product/baseTrademark/getTrademarkList')
  }
}


// 练习
// export default {
//   // 删除
//   delete(id){
//     return request.delete(`/admin/product/baseTrademark/remove/${id}`)
//   },
//   // 增加修改
//   addOrUpdata(trademark){
//     if(trademark.id){
//       return request.put('/admin/product/baseTrademark/update',trademark)
//     } else {
//       return request.post('/admin/product/baseTrademark/save',trademark)
//     }
//   },
//   // 查
//   getTrademarkList(page,limit){
//     return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
//   }
// }