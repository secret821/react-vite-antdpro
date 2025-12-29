import axios from 'axios'
import type { StockOrder } from '@/pages/StockOrderList'

// 配置 axios 基础 URL（实际项目中应该从环境变量读取）
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

// 请求拦截器 - 添加 token
api.interceptors.request.use((config) => {
  // 从 cookie 中读取 token（与 auth-store 保持一致）
  const cookies = document.cookie.split(';')
  const tokenCookie = cookies.find((c) => c.trim().startsWith('thisisjustarandomstring='))
  if (tokenCookie) {
    try {
      const token = JSON.parse(tokenCookie.split('=')[1])
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (e) {
      // 解析失败，忽略
    }
  }
  return config
})

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * 获取新股申购订单列表
 * 这里使用模拟数据，实际项目中应该调用真实 API
 */
export const getStockOrders = async (): Promise<StockOrder[]> => {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 500))

  // 返回模拟数据
  return Array.from({ length: 50 }, (_, i) => ({
    id: `order-${i + 1}`,
    orderNo: `ORD${String(i + 1).padStart(6, '0')}`,
    userName: `用户${i + 1}`,
    stockName: `新股${i + 1}`,
    stockCode: `600${String(i + 1).padStart(3, '0')}`,
    exchange: i % 2 === 0 ? '上交所' : '深交所',
    orderType: '申购',
    payType: i % 3 === 0 ? '现金' : '信用',
    orderStatus: (['已转股', '未转股', '处理中'] as const)[i % 3],
    applyAmount: Math.floor(Math.random() * 10000) + 1000,
    successAmount: Math.floor(Math.random() * 5000) + 500,
    price: Math.floor(Math.random() * 100) + 10,
    total: 0,
    paid: 0,
    unpaid: 0,
  })).map((order) => ({
    ...order,
    total: order.successAmount * order.price,
    paid: Math.floor((order.successAmount * order.price) * 0.8),
    unpaid: Math.floor((order.successAmount * order.price) * 0.2),
  }))

  // 实际项目中应该这样调用：
  // const res = await api.get<StockOrder[]>('/stock-orders')
  // return res.data
}

