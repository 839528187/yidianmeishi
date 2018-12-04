import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/category',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/category',
    method: 'post',
    data
  })
}

export function update(data, id) {
  return request({
    url: '/category/' + id,
    method: 'put',
    data
  })
}

export function parentSearch() {
  return request({
    url: '/category/parent',
    method: 'get'
  })
}

export function deletes(id) {
  return request({
    url: '/category/' + id,
    method: 'delete'
  })
}

export function newsSearch() {
  return request({
    url: '/category/search',
    method: 'get'
  })
}
