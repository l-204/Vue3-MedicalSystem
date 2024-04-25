import request from '../utils/request'

export function getEmail(){
    return request({
        url: '/api/all/select/email',
        method: 'get'
    })
}

export function getEmailUser( min_id: number, max_id: number){
    return request({
        url: '/api/email/user',
        method: 'post',
        data: { min_id, max_id }
    })
}