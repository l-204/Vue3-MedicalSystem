import {request} from '../utils/request'//导入request

export function Login(listData: any) {
    return request({
        url: '/api/login/login',//此处为自己请求地址
        method: 'post',//请求类型
        data: listData
    })
}