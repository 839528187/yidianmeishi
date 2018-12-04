import request from '@/utils/request'

export function list(query) {
  return request({
    url: '/admin',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/admin',
    method: 'post',
    data
  })
}

export function update(data, id) {
  return request({
    url: '/admin/password/' + id,
    method: 'put',
    data
  })
}

export function disable(id) {
  return request({
    url: '/admin/' + id,
    method: 'delete'
  })
}

// export function logout() {
//   return request({
//     url: '/user/logout',
//     method: 'post'
//   })
// }
