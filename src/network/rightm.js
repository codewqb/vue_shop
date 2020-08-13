import {
  request
} from './request'
// 请求权限列表信息(列表list)
export function getRightList() {
  return request({
    method: 'get',
    url: 'rights/list'
  })
}
// 请求角色列表信息
export function getRoleList() {
  return request({
    method: 'get',
    url: 'roles'
  })
}
// 添加角色请求
export function postAddRole(data) {
  return request({
    method: 'post',
    url: 'roles',
    data
  })
}
// 根据id查询角色信息
export function getRoleInfo(id) {
  return request({
    method: 'get',
    url: 'roles/' + id
  })
}
// 编辑角色提交信息
export function editRoleInfo(data) {
  return request({
    method: 'put',
    url: 'roles/' + data.roleId,
    data: {
      roleName: data.roleName,
      roleDesc: data.roleDesc
    }
  })
}
// 删除角色信息
export function deleteRole(id) {
  return request({
    method: 'delete',
    url: 'roles/' + id
  })
}
// 删除角色指定权限
export function deleteRight(role, rightId) {
  return request({
    method: 'delete',
    url: 'roles/' + role.id + '/rights/' + rightId
  })
}
// 请求所有权限列表信息(树tree)
export function getRightTree() {
  return request({
    method: 'get',
    url: 'rights/tree'
  })
}
// 角色授权
export function setRight(id, data) {
  return request({
    method: 'post',
    url: 'roles/' + id + '/rights',
    data: {
      rids: data
    }
  })
}
