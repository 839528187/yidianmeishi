import request from '@/plugin/axios'

export function AccountLogin (data) {
  return request({
    url: '/admin/login',
    method: 'post',
    data
  })
}
