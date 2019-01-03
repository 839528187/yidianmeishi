import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/topicDetails',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/topicDetails',
    method: 'post',
    data
  })
}

export function findOne(id) {
  return request({
    url: '/topicDetails/' + id,
    method: 'get'
  })
}

export function update(id, data) {
  return request({
    url: '/topicDetails/' + id,
    method: 'put',
    data
  })
}
