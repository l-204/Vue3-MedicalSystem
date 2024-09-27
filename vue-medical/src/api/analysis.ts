import { request } from '@/utils/request'

export function getColumnData(keyName:string, tableName:string){
    return request({
        url:`/api/analysis/${keyName}/${tableName}`,
        method:'get'
    })
}