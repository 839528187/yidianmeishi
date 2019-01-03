import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/atlas',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/atlas',
    method: 'post',
    data
  })
}

export function deletes(id) {
  return request({
    url: '/atlas/' + id,
    method: 'delete'
  })
}

