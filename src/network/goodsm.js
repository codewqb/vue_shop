import {
  request
} from './request'
// Categories
// 请求分类列表
export function getCateList(params) {
  return request({
    method: 'get',
    url: 'categories',
    params
  })
}
// 请求父级分类列表
export function getParentCateList() {
  return request({
    method: 'get',
    url: 'categories',
    params: {
      type: 2
    }
  })
}
// 添加分类请求
export function postAddCate(data) {
  return request({
    method: 'post',
    url: 'categories',
    data
  })
}
// 根据 id 查询分类
export function getCateById(id) {
  return request({
    method: 'get',
    url: 'categories/' + id
  })
}
// 编辑提交分类
export function editCate(data) {
  return request({
    method: 'get',
    url: 'categories/' + data.cat_id,
    data: {
      cat_name: data.cat_name
    }
  })
}
// 删除分类
export function deleteCate(id) {
  return request({
    method: 'delete',
    url: 'categories/' + id,
  })
}
// Params
// 请求所有分类列表
export function getAllCateList() {
  return request({
    method: 'get',
    url: 'categories',
  })
}
// 获取参数列表
export function getParamsList(id, sel) {
  return request({
    method: 'get',
    url: 'categories/' + id + '/attributes',
    params: {
      sel: sel
    }
  })
}
// Goods_list
// 获取商品列表
export function getGoodsList(params) {
  return request({
    method: 'get',
    url: 'goods',
    params
  })
}
// 删除商品
export function deleteGoods(id) {
  return request({
    method: 'delete',
    url: 'goods/' + id
  })
}
