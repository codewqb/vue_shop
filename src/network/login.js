import {
  request
} from './request';
export function postLoginFrom(data) {
  return request({
    method: 'POST',
    url: '/login',
    data: data
  })
}
