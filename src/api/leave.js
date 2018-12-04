import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/leave',
    method: 'get',
    params: query
  })
}

export function view(id) {
  return request({
    url: '/leave/' + id,
    method: 'get'
  })
}

export function dispose(id) {
  return request({
    url: '/leave/' + id,
    method: 'put'
  })
}
