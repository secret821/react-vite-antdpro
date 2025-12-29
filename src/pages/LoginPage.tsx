import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthProvider'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    try {
      // 模拟登录 API 调用
      // 实际项目中这里应该调用真实的登录接口
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 模拟返回的 token 和用户信息
      const mockToken = 'mock-jwt-token-' + Date.now()
      const mockUser = {
        accountNo: 'A001',
        email: values.email,
        role: ['admin'],
        exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7天后过期
      }

      login(mockToken, mockUser)
      message.success(t('login.loginSuccess'))
      navigate('/')
    } catch (error) {
      message.error(t('login.loginError'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="w-full max-w-md px-4">
        <Card className="shadow-2xl border-0 rounded-2xl">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <UserOutlined className="text-2xl text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('login.title')}</h1>
            <p className="text-gray-500">{t('login.subtitle')}</p>
          </div>
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            size="large"
            layout="vertical"
          >
            <Form.Item
              name="email"
              label={<span className="text-gray-700 font-medium">{t('login.email')}</span>}
              rules={[
                { required: true, message: t('login.emailRequired') },
                { type: 'email', message: t('login.emailInvalid') },
              ]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder={t('login.emailPlaceholder')}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label={<span className="text-gray-700 font-medium">{t('login.password')}</span>}
              rules={[{ required: true, message: t('login.passwordRequired') }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder={t('login.passwordPlaceholder')}
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                className="w-full h-12 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-shadow"
                loading={loading}
              >
                {t('login.login')}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  )
}

