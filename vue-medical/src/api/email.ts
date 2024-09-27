import request from '@/utils/request'

export function getAllEmail(){
    return request({
        url: '/api/table/select/email',
        method: 'get'
    })
}

export function setEmail(formData: object){
    return request({
        url:'/api/table/insert/email',
        method:'post',
        data: formData,
    })
}

export function deleteEmail(){
    return request({
        url:'/api/table/delete/email',
        method:'',
    })
}

export function getUserEmail(){
    return request({
        url: '/api/email/user',
        method: 'get',
    })
}

export function setSelectedEmail(selectedEmails: Array<object>){
    return request({
        url:'/api/email/selected',
        method:'post',
        data: selectedEmails
    })
}