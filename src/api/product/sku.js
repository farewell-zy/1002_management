import request from '@/utils/request'


export default {
  // 根据spu的id对应的图片列表
  getSpuImageList(spuId) {
    return request.get(`/admin/product/spuImageList/${spuId}`)
  },

  // 获取指定SPU对应的销售属性列表
  getSpuSaleAttrList(spuId){
    return request.get(`/admin/product/spuSaleAttrList/${spuId}`)
  },

  // 保存修改SKU
  addUpdate(skuInfo){
    return request.post(`/admin/product/${skuInfo.id? 'update' : 'save'}SkuInfo`,skuInfo)
  },

  // 根据指定的SPU的id查询所有对应的sku列表
  getListBySpuId(spuId){
    return request.get(`/admin/product/findBySpuId/${spuId}`)
  },






  
  /* 
  下架SKU
  GET /admin/product/cancelSale/{skuId}
  */
  cancelSale (skuId) {
    return request.get(`/admin/product/cancelSale/${skuId}`)
  },

  /* 
  上架SKU
  GET /admin/product/onSale/{skuId}
  */
  onSale (skuId) {
    return request.get(`/admin/product/onSale/${skuId}`)
  },

  /* 
  删除指定id的sku
  DELETE /admin/product/deleteSku/{skuId}
  */
  remove (skuId) {
    return request.delete(`/admin/product/deleteSku/${skuId}`)
  },

  /* 
  根据指定的SPU的id查询所有对应的SKU的列表
  GET /admin/product/findBySpuId/{spuId}
  */
  getListBySpuId (spuId) {
    return request.get(`/admin/product/findBySpuId/${spuId}`)
  },

  /* 
  根据SKU的id查询SKU的详细信息
  GET /admin/product/getSkuById/{skuId}
  */
  get (skuId) {
    return request.get(`/admin/product/getSkuById/${skuId}`)
  },

  /* 
  获取SKU的分页列表
  GET /admin/product/list/{page}/{limit}
  */
  getList (page, limit) {
    return request.get(`/admin/product/list/${page}/${limit}`)
  },


}