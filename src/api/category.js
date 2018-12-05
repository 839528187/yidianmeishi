import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/cate',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/cate',
    method: 'post',
    data
  })
}

export function update(data, id) {
  return request({
    url: '/cate/' + id,
    method: 'put',
    data
  })
}

export function deletes(id) {
  return request({
    url: '/cate/' + id,
    method: 'delete'
  })
}

export function newsSearch() {
  return request({
    url: '/cate/each',
    method: 'get'
  })
}
