import { request } from '@/utils/request'

// 单表查询
export const getTableData = (tableName:string)=>{
    return request({
        url:`/api/table/select/${tableName}`,
        method:'get',
    })
}
// 多表查询
export const getTablesData = (tableNames:Array<string>)=>{
    return request({
        url:`/api/table/select`,
        method:'post',
        data:tableNames
    })
}
// 搜索
export const searchData = (searchForm:Array<string>) => {
    return request({
        url:'/api/table/search',
        method:'post',
        data: searchForm
    })
}
// 删除
export const deleteData = (id:number,tableName:string) => {
    return request({
        url:`/api/table/delete/${id}/${tableName}`,
        method:'delete'
    })
}
// 提交
export const submitData = (operation:string,tableName:string,formData:object) => {
    return request({
        url:`/api/table/${operation}/${tableName}`,
        method:'post',
        data: formData
    })
}