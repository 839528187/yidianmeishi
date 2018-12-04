import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/school',
    method: 'get',
    params: query
  })
}

export function schoolSearch(query) {
  return request({
    url: '/school/search',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/school',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: '/school/' + id,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: '/school/' + id,
    method: 'put',
    data
  })
}

export function deletes(id) {
  return request({
    url: '/school/' + id,
    method: 'delete'
  })
}
