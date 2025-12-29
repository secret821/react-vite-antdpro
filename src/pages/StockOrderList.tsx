import { useQuery } from '@tanstack/react-query'
import type { ProColumns } from '@ant-design/pro-components'
import { ProTable } from '@ant-design/pro-components'
import { Card, Tag, Button, message } from 'antd'
import { useTranslation } from 'react-i18next'
import { getStockOrders } from '@/services/stock'

export type StockOrder = {
  id: string
  orderNo: string
  userName: string
  stockName: string
  stockCode: string
  exchange: string
  orderType: string
  payType: string
  orderStatus: '已转股' | '未转股' | '处理中'
  applyAmount: number
  successAmount: number
  price: number
  total: number
  paid: number
  unpaid: number
}

export function StockOrderList() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['stock-orders'],
    queryFn: getStockOrders,
  })

  const columns: ProColumns<StockOrder>[] = [
    {
      title: t('stockOrder.orderNo'),
      dataIndex: 'orderNo',
      width: 180,
      copyable: true,
    },
    {
      title: t('stockOrder.userName'),
      dataIndex: 'userName',
      width: 120,
    },
    {
      title: t('stockOrder.stockName'),
      dataIndex: 'stockName',
      width: 150,
    },
    {
      title: t('stockOrder.stockCode'),
      dataIndex: 'stockCode',
      width: 100,
    },
    {
      title: t('stockOrder.exchange'),
      dataIndex: 'exchange',
      width: 100,
    },
    {
      title: t('stockOrder.orderStatus'),
      dataIndex: 'orderStatus',
      width: 100,
      render: (_, record) => {
        const statusMap: Record<string, string> = {
          '已转股': t('stockOrder.status.converted'),
          '未转股': t('stockOrder.status.notConverted'),
          '处理中': t('stockOrder.status.processing'),
        }
        const colorMap: Record<string, string> = {
          '已转股': 'green',
          '未转股': 'blue',
          '处理中': 'orange',
        }
        return (
          <Tag color={colorMap[record.orderStatus]}>
            {statusMap[record.orderStatus] || record.orderStatus}
          </Tag>
        )
      },
    },
    {
      title: t('stockOrder.applyAmount'),
      dataIndex: 'applyAmount',
      width: 100,
      sorter: true,
    },
    {
      title: t('stockOrder.successAmount'),
      dataIndex: 'successAmount',
      width: 100,
      sorter: true,
    },
    {
      title: t('stockOrder.price'),
      dataIndex: 'price',
      width: 100,
      render: (value) => `¥${value}`,
      sorter: true,
    },
    {
      title: t('stockOrder.total'),
      dataIndex: 'total',
      width: 120,
      render: (value) => `¥${value.toLocaleString()}`,
      sorter: true,
    },
    {
      title: t('stockOrder.paid'),
      dataIndex: 'paid',
      width: 120,
      render: (value) => `¥${value.toLocaleString()}`,
      sorter: true,
    },
    {
      title: t('stockOrder.unpaid'),
      dataIndex: 'unpaid',
      width: 120,
      render: (value) => `¥${value.toLocaleString()}`,
      sorter: true,
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-semibold text-gray-900">{t('layout.stockOrders')}</h1>
      </div>
      <Card className="shadow-sm border-0 rounded-xl">
        <ProTable<StockOrder>
          rowKey="id"
          columns={columns}
          loading={isLoading}
          dataSource={data || []}
          search={{
            labelWidth: 80,
            searchText: t('common.search'),
            resetText: t('common.reset'),
            optionRender: (searchConfig, formProps, dom) => [
              ...dom.reverse(),
            ],
          }}
          toolBarRender={() => [
            <Button
              key="export"
              onClick={() => message.info(t('stockOrder.exportFeature'))}
              className="rounded-lg"
            >
              {t('common.export')}
            </Button>,
            <Button
              key="add"
              type="primary"
              onClick={() => message.info(t('stockOrder.addFeature'))}
              className="rounded-lg shadow-md"
            >
              {t('common.add')}
            </Button>,
          ]}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => (
              <span className="text-gray-600">{t('common.total', { count: total })}</span>
            ),
          }}
          options={{
            reload: true,
            density: true,
            fullScreen: true,
          }}
        />
      </Card>
    </div>
  )
}

