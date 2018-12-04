import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/entourage',
    method: 'get',
    params: query
  })
}

export function deletes(id) {
  return request({
    url: '/entourage/' + id,
    method: 'delete'
  })
}
