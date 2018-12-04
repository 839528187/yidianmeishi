import request from '@/utils/request'

export function typeIntroduce(data) {
  return request({
    url: '/mapping/introduce',
    method: 'post',
    data
  })
}

export function typeCourse(data) {
  return request({
    url: '/mapping/course',
    method: 'post',
    data
  })
}

export function typeProspect(data) {
  return request({
    url: '/mapping/prospect',
    method: 'post',
    data
  })
}

export function typeDirection(data) {
  return request({
    url: '/mapping/direction',
    method: 'post',
    data
  })
}

export function getOne(id) {
  return request({
    url: '/mapping/' + id,
    method: 'get'
  })
}
