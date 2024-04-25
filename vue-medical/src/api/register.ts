import {request} from '../utils/request'//导入request

export function Register(listData: any) {
    return request({
        url: '/api/register',//此处为自己请求地址
        method: 'post',//请求类型
        data: listData
    })
}