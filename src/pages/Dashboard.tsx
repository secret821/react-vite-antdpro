import { Card, Row, Col, Statistic } from 'antd'
import { UserOutlined, ShoppingOutlined, DollarOutlined, RiseOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { cx } from '@/utils/cn'

export function Dashboard() {
  const { t } = useTranslation()
  return (
    <div>
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-semibold text-gray-900">{t('dashboard.title')}</h1>
      </div>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={cx(
              'hover:shadow-lg transition-all duration-300 border-0',
              'bg-gradient-to-br from-green-50 to-green-100/50',
            )}
            hoverable
          >
            <Statistic
              title={<span className="text-gray-600">{t('dashboard.totalUsers')}</span>}
              value={1128}
              prefix={<UserOutlined className="text-green-600" />}
              valueStyle={{ color: '#16a34a', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={cx(
              'hover:shadow-lg transition-all duration-300 border-0',
              'bg-gradient-to-br from-blue-50 to-blue-100/50',
            )}
            hoverable
          >
            <Statistic
              title={<span className="text-gray-600">{t('dashboard.totalOrders')}</span>}
              value={2340}
              prefix={<ShoppingOutlined className="text-blue-600" />}
              valueStyle={{ color: '#2563eb', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={cx(
              'hover:shadow-lg transition-all duration-300 border-0',
              'bg-gradient-to-br from-red-50 to-red-100/50',
            )}
            hoverable
          >
            <Statistic
              title={<span className="text-gray-600">{t('dashboard.totalAmount')}</span>}
              value={112893}
              prefix={<DollarOutlined className="text-red-600" />}
              precision={2}
              valueStyle={{ color: '#dc2626', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={cx(
              'hover:shadow-lg transition-all duration-300 border-0',
              'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
            )}
            hoverable
          >
            <Statistic
              title={<span className="text-gray-600">{t('dashboard.growthRate')}</span>}
              value={9.3}
              prefix={<RiseOutlined className="text-emerald-600" />}
              suffix="%"
              valueStyle={{ color: '#16a34a', fontSize: '28px', fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}

