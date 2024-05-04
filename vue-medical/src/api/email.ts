import request from '../utils/request'

export function getAllEmail(){
    return request({
        url: '/api/all/select/email',
        method: 'get'
    })
}

export function getUserEmail(){
    return request({
        url: '/api/email/user',
        method: 'get',
    })
}

export function setEmail(formData: object){
    return request({
        url:'/api/all/insert/email',
        method:'post',
        data: formData,
    })
}

export function updateEmail(){
    return request({
        url:'/api/all/update/email',
        method:'',
    })
}

export function deleteEmail(){
    return request({
        url:'/api/all/delete/email',
        method:'',
    })
}