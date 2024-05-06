import { request } from '../utils/request'//导入request

export function updateUser(listData: any) {
    return request({
        url: '/api/user/update',//此处为自己请求地址
        method: 'post',//请求类型
        data: listData
    })
}

// export function getUser(listData: any) {
//     return request({
//         url: '/api/user/select/username',//此处为自己请求地址
//         method: 'post',//请求类型
//         data: listData
//     })
// }

export function getUserIdList() {
    return request({
        url: '/api/user/select/id',//此处为自己请求地址
        method: 'get',//请求类型
    })
}

export function setAvatar(id:number, url:string){
    return request({
        url:`/api/user/avatar`,
        method:'post',
        data:{id,url}
    })
}
