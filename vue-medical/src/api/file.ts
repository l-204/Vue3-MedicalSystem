import { request } from '@/utils/request'

export function uploadAvatar(id:number, formData:FormData){
    return request({
        url:`/api/file/avatar/${id}`,
        method:'post',
        headers: {
            "Content-Type": "multipart/form-data",
          },
          data:formData
    })
}