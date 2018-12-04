import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/type',
    method: 'get',
    params: query
  })
}

export function parent() {
  return request({
    url: '/type/parent',
    method: 'get'
  })
}

export function create(data) {
  return request({
    url: '/type',
    method: 'post',
    data
  })
}

export function update(data, id) {
  return request({
    url: '/type/' + id,
    method: 'put',
    data
  })
}

export function deletes(id) {
  return request({
    url: '/type/' + id,
    method: 'delete'
  })
}

export function typeSearch() {
  return request({
    url: '/type/search',
    method: 'get'
  })
}
