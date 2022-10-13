import requests from "./requests";
export const PostAdminRegisterRequest = (account,password) => requests({
    method: "post",
    url: "/admin/register",
    data: { account, password }
})
// 登陆
export const PostAdminLoginRequest = (account, password) => requests({
    method: "post",
    url: "/admin/login",
    data: { account, password }
})
// 获取分类列表
export const GetCategoryListRequest = () => requests({
    method: "get",
    url: "/category/list",
})
// 新增分类列表
export const PostAddCategoryRequest = (name) => requests({
    method: "post",
    url: "/category/add",
    data: {
        name
    }
})
// 编辑分类列表
export const PutUpdateCategoryRequest = (id, name) => requests({
    method: "put",
    url: "/category/update",
    data: {
        id, name
    }
})
// 删除分类列表
export const DeleteCategoryRequest = (id) => requests({
    method: "delete",
    url: "/category/delete",
    data: { id }
})
// 添加博客
export const PostAddBlogRequest = (title, category_id, content) => requests({
    method: "post",
    url: "/blog/add",
    data: {
        title,
        category_id,
        content
    }

})
// 获取博客列表
export const GetBlogListRequest = ({ keyword, categoryid, page, pageSize }) => requests({
    method: "get",
    url: `/blog/list?keyword=${keyword}&categoryid=${categoryid}&page=${page}&pageSize=${pageSize}`,

})
// 编辑博客
export const PutUpdateBlogRequest = ({ id, title, content, category_id }) => requests({
    method: "put",
    url: "/blog/update",
    data: {
        id, title, content, category_id
    }

})
// 删除博客
export const DeleteBlogRequest = (id) => requests({
    method: "delete",
    url: "/blog/delete",
    data: { id }

})
// 获取博客详情
export const GetBlogDetailRequest = (id) => requests({
    method: "get",
    url: `/blog/detail?id=${id}`,
})