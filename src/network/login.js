import {
  request
} from './request';
export function postLoginForm(data) {
  return request({
    method: 'POST',
    url: '/login',
    data
  })
}
