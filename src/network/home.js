import {
  request
} from './request';
// 请求左侧菜单数据
export function getMenuList() {
  return request({
    method: 'get',
    url: 'menus',
  })
}
