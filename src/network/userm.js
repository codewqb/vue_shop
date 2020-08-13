import {
  request
} from './request';
// 请求用户列表数据
export function getUserList(params) {
  return request({
    method: 'get',
    url: 'users',
    params
  })
}
// 修改用户列表的用户状态
export function changeUserState(userinfo) {
  return request({
    method: 'put',
    url: 'users/' + userinfo.id + '/state/' + userinfo.mg_state
  })
}
// 添加用户发送请求
export function postAddUser(data) {
  return request({
    method: 'post',
    url: 'users',
    data
  })
}
// 根据id查询用户信息
export function getUserInfo(id) {
  return request({
    method: 'get',
    url: 'users/' + id
  })
}
// 编辑用户提交信息
export function editUserInfo(data) {
  return request({
    method: 'put',
    url: 'users/' + data.id,
    data: {
      email: data.email,
      mobile: data.mobile
    }
  })
}
// 删除用户信息
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: 'users/' + id
  })
}
// 分配用户角色请求
export function setRole(id, data) {
  return request({
    method: 'put',
    url: 'users/' + id + '/role',
    data: {
      rid: data
    }
  })
}
