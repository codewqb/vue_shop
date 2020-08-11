import axios from 'axios'
// config:配置
export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://127.0.0.1:8888/api/private/v1/',
    timeout: 5000
  })
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    return config
  }, err => {

  })
  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res
  }, err => {
    console.log(err);
  })

  return instance(config)
}
