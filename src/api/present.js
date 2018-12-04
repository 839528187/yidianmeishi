import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/schoolPresent',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/schoolPresent',
    method: 'post',
    data
  })
}

export function update(id, data) {
  return request({
    url: '/schoolPresent/' + id,
    method: 'put',
    data
  })
}

export function deletes(id) {
  return request({
    url: '/schoolPresent/' + id,
    method: 'delete'
  })
}
