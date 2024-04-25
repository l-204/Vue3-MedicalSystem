import { request } from '../utils/request'

// 单表查询
export const getTableData = (tableName:string)=>{
    return request({
        url:`/api/all/select/${tableName}`,
        method:'get',
    })
}
// 多表查询
export const getTablesData = (tableNames:Array<string>)=>{
    return request({
        url:`/api/all/select`,
        method:'post',
        data:tableNames
    })
}
// 搜索
export const searchData = (searchForm:Array<string>) => {
    return request({
        url:'/api/all/search',
        method:'post',
        data: searchForm
    })
}
// 删除
export const deleteData = (id:number,tableName:string) => {
    return request({
        url:`/api/all/delete/${id}/${tableName}`,
        method:'delete'
    })
}
// 提交
export const submitData = (operation:string,tableName:string,formData:object) => {
    return request({
        url:`/api/all/${operation}/${tableName}`,
        method:'post',
        data: formData
    })
}