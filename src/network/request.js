import axios from 'axios'
// config:配置
export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    // 基准地址
    baseURL: '/api/private/v1/',
    // 超时
    timeout: 5000
  })
  // 2.axios的拦截器
  // 2.1.请求拦截的作用
  instance.interceptors.request.use(config => {
    // 为请求头对象添加token验证的Authorization的字段
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
  }, err => {
    console.log(err);
  })
  // 2.2.响应拦截
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    console.log(err);
  })

  return instance(config)
}
