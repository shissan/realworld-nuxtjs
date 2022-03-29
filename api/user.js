import request from "@/utils/request"

export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data
  })
}

export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data
  })
}

export const getProfiles = username => {
  return request({
    method: 'GET',
    url: `/api/profiles/${username}`
  })
}

export const addProfilesFollow = username => {
  return request({
    method: 'POST',
    url: `/api/profiles/${username}/follow`
  })
}

export const deleteProfilesFollow = username => {
  return request({
    method: 'DELETE',
    url: `/api/profiles/${username}/follow`
  })
}

export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data
  })
}