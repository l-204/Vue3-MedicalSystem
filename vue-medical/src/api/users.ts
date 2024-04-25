import {request} from '../utils/request'//导入request
export function EditUser(listData: any) {
    return request({
        url: '/api/users/update',//此处为自己请求地址
        method: 'post',//请求类型
        data: listData
    })
}

export function GetUser(listData: any) {
    return request({
        url: '/api/users',//此处为自己请求地址
        method: 'post',//请求类型
        data: listData
    })
}

export function GetAvatar(){
    return request({
        url:'/api/files/avatar',
        method:'post',
    })
}

export function uploadAvatar(id:number, formData:FormData){
    return request({
        url:`/api/upload/avatar/${id}`,
        method:'post',
        headers: {
            "Content-Type": "multipart/form-data",
          },
          data:formData
    })
}

export function setAvatar(id:number, url:string){
    return request({
        url:`/api/users/avatar`,
        method:'post',
        data:{id,url}
    })
}
