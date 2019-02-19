import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/food',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/food',
    method: 'post',
    data
  })
}
export function findOne(id) {
  return request({
    url: '/food/' + id,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: '/food/' + id,
    method: 'put',
    data
  })
}
export function deletes(id) {
  return request({
    url: '/food/' + id,
    method: 'delete'
  })
}
