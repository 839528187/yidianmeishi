import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/links',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/links',
    method: 'post',
    data
  })
}

export function update(data, id) {
  return request({
    url: '/links/' + id,
    method: 'put',
    data
  })
}

export function disable(id) {
  return request({
    url: '/links/disable/' + id,
    method: 'delete'
  })
}

export function deletes(id) {
  return request({
    url: '/links/' + id,
    method: 'delete'
  })
}
