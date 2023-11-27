export interface RequestParams {
    page: number
    offset: number
    per_page: number
    order_by: string
    sort_order: string
    keyword: string
    [key: string]: any
}

export const GetRequestParams = (query: Record<string, any>): RequestParams => {
    const per_page = Number(query.per_page) || 100
    const page = Number(query.page) || 1
    const offset = per_page * (page - 1)
    let { q, sort_order, order_by } = query

    if (!['ASC', 'DESC'].includes(order_by)) {
        order_by = 'ASC'
    }

    return {
        ...query,
        page,
        offset,
        per_page,
        sort_order,
        order_by,
        keyword: q,
    }
}

export const GetMeta = (request: RequestParams, count: number) => {
    const last_page = Math.ceil(count / request.per_page)
    return {
        per_page: request.per_page,
        last_page: last_page,
        current_page: request.page,
        total: count,
        has_next: request.page < last_page,
        has_prev: request.page > 1,
        from: request.offset + 1,
    }
}
