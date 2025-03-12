import request from '@/utils/request'
import userData from '@/json/user/user.json'
import menuData from '@/json/menu/menu.json'

// 用户相关接口
export const userApi = {
    // 登录
    login: (data) => {
        return request({
            url: '/user/login',
            method: 'post',
            data
        })
    },
    // 获取用户信息
    getUserInfo: () => {
        return request({
            url: '/user/info',
            method: 'get'
        })
    },
    // 获取用户列表
    getUserList: (params) => {
        return request({
            url: '/user/list',
            method: 'get',
            params
        })

        // 模拟后端分页和筛选
        // return new Promise((resolve) => {
        //     let result = [...userData]

        //     // 筛选
        //     if (params.username) {
        //         result = result.filter(item => item.username.includes(params.username))
        //     }
        //     if (params.phone) {
        //         result = result.filter(item => item.phone.includes(params.phone))
        //     }
        //     if (params.status) {
        //         result = result.filter(item => item.status === params.status)
        //     }

        //     // 计算总数
        //     const total = result.length

        //     // 分页
        //     const start = (params.page - 1) * params.pageSize
        //     const end = start + params.pageSize
        //     result = result.slice(start, end)

        //     // 模拟接口返回格式
        //     resolve({
        //         code: 200,
        //         data: {
        //             list: result,
        //             total: total
        //         }
        //     })
        // })
    }
}

// 菜单相关接口
export const menuApi = {
    // 获取菜单列表
    getList: (params) => {
        // return request({
        //     url: '/menu/list',
        //     method: 'get',
        //     params
        // })

        // 模拟后端分页和筛选
        return new Promise((resolve) => {
            let result = [...menuData]

            // 筛选
            const filterMenus = (menus) => {
                return menus.filter(menu => {
                let match = true
                if (params.menuName) {
                    match = match && menu.menuName.includes(params.menuName)
                }
                if (params.permission) {
                    match = match && menu.permission.includes(params.permission)
                }
                if (params.status) {
                    match = match && menu.status === params.status
                }
                if (menu.children) {
                    menu.children = filterMenus(menu.children)
                }
                return match || (menu.children && menu.children.length > 0)
                })
            }

            if (params.menuName || params.permission || params.status) {
                result = filterMenus(result)
            }

            // 模拟接口返回格式
            resolve({
                code: 200,
                data: {
                list: result,
                total: result.length
                }
            })
        })
    },
    // 添加菜单
    add: (data) => {
        return request({
            url: '/menu/add',
            method: 'post',
            data
        })
    },
    // 更新菜单
    update: (data) => {
        return request({
            url: '/menu/update',
            method: 'put',
            data
        })
    },
    // 删除菜单
    delete: (id) => {
        return request({
            url: `/menu/delete/${id}`,
            method: 'delete'
        })
    }
}

// 字典相关接口
export const dictApi = {
    // 获取字典列表
    getList: (params) => {
        return request({
            url: '/dict/list',
            method: 'get',
            params
        })
    },
    // 获取字典详情
    getDetail: (id) => {
        return request({
            url: `/dict/detail/${id}`,
            method: 'get'
        })
    }
}