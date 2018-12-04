import request from '@/utils/request'

export function indexs() {
  return request({
    url: '/index',
    method: 'get'
  })
}

export function webRedis() {
  return request({
    url: '/redis',
    method: 'get'
  })
}

export function webType() {
  return request({
    url: '/redis/type',
    method: 'get'
  })
}

export function webArea() {
  return request({
    url: '/redis/area',
    method: 'get'
  })
}
