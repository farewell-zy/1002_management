import request from '@/utils/request'

export default {
  // get  /admin/product/baseSaleAttrList
  // 获取所有spu销售属性
  getSaleAttrList(){
    return request.get('/admin/product/baseSaleAttrList')
  },

  // delete /admin/product/deleteSpu/{spuId}
  // 删除指定SPU
  remove(spuId){
    return request.delete(`/admin/product/deleteSpu/${spuId}`)
  },

  // get /admin/product/getSpuById/{spuId}
  // 根据获取spu详情信息
  get(spuId){
    return request.get(`/admin/product/getSpuById/${spuId}`)
  },

  // post /admin/product/saveSpuInfo
  // post /admin/product/updateSpuInfo
  // 添加或修改
  addUpdate(spuInfo){
    return request({
      url: `/admin/product/${spuInfo.id ? 'update' : 'save'}SpuInfo`,
      method: 'post',
      data: spuInfo
    })
  },

  // get /admin/product/{page}/{limit} 
  // 获取spu的分页列表数据
  getList(page, limit, category3Id){
    return request({
      url: `/admin/product/${page}/${limit}`,
      method: 'get',
      params: {category3Id}
    })
  }
}