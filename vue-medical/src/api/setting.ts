import {request} from '@/utils/request'

export const updateRight = (id:string,isAdmin:boolean)=>{
    return request({
        url:`/api/setting/${id}/${isAdmin}`,
        method:'get',
    })
}