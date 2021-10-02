// 这个文件目的是把所有的接口整合到一起，然后一起去暴露
// 引入并暴露
// import { default as trademark } from './trademark'
// export trademark

// 使用引入并暴露的方式，default引入的时候不能简写
export {default as trademark} from './trademark'
export {default as attr} from './attr'
export {default as category} from './category'
export {default as sku} from './sku'
export {default as spu} from './spu'

// 相当于是分别暴露了 trademark和attr对象

// 最终出去的是
// {
//   trademark,
//   attr
// }