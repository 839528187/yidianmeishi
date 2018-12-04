import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/area',
    method: 'get',
    params: query
  })
}

export function operating(id) {
  return request({
    url: '/area/' + id,
    method: 'put'
  })
}

export function update(data, id) {
  return request({
    url: '/area/update/' + id,
    method: 'put',
    data
  })
}

export function parent() {
  return request({
    url: '/area/parent',
    method: 'get'
  })
}

export function search() {
  return request({
    url: '/area/search',
    method: 'get'
  })
}
