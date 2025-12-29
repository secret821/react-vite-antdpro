import { useMemo, useState } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { ProLayout, PageContainer } from '@ant-design/pro-components'
import { ConfigProvider, Popover, Dropdown, Avatar } from 'antd'
import type { MenuProps } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import enUS from 'antd/locale/en_US'
import { LogoutOutlined, DashboardOutlined, ShoppingOutlined, GlobalOutlined } from '@ant-design/icons'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthProvider'
import { useLanguage } from '@/hooks/useLanguage'
import { cx } from '@/utils/cn'

export function ProShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { language, changeLanguage } = useLanguage()
  const [collapsed, setCollapsed] = useState(false)

  const pathname = location.pathname

  const menuItems = useMemo(
    () => [
      {
        path: '/',
        name: t('layout.home'),
        icon: <DashboardOutlined />,
      },
      {
        path: '/stock-orders',
        name: t('layout.stockOrders'),
        icon: <ShoppingOutlined />,
      },
    ],
    [t]
  )

  const antdLocale = language === 'en-US' ? enUS : zhCN

  const languageMenuItems: MenuProps['items'] = [
    {
      key: 'zh-CN',
      label: (
        <span className="flex items-center gap-2">
          <span>🇨🇳</span>
          <span>中文</span>
        </span>
      ),
      onClick: () => changeLanguage('zh-CN'),
    },
    {
      key: 'en-US',
      label: (
        <span className="flex items-center gap-2">
          <span>🇺🇸</span>
          <span>English</span>
        </span>
      ),
      onClick: () => changeLanguage('en-US'),
    },
  ]

  const loginOut = (<Popover content={t('common.logout')}>
    <LogoutOutlined
      style={{ color: '#fff' }}
      className="cursor-pointer transition-colors hover:text-red-500 hover:opacity-80 text-lg"
      onClick={() => {
        logout()
        navigate('/login')
      }}
    />
  </Popover>)

  return (
    <ConfigProvider locale={antdLocale}>
      <ProLayout
        title={t('layout.title')}
        route={{ routes: menuItems }}
        location={{ pathname }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => item.path && navigate(item.path)}
            className="cursor-pointer"
          >
            {dom}
          </div>
        )}
        actionsRender={() => [
          <Dropdown
            key="language"
            menu={{ items: languageMenuItems, selectedKeys: [language] }}
            placement="bottomRight"
          >
            <div
              className="flex items-center gap-1 cursor-pointer px-3 py-1 rounded hover:bg-white/10 transition-colors"
              style={{ color: '#fff' }}
            >
              <GlobalOutlined />
              <span className="text-sm">
                {language === 'zh-CN' ? '中文' : 'English'}
              </span>
            </div>
          </Dropdown>,
        ]}
        menuFooterRender={() => (
          <div
            className={cx('border-t border-white/10', {
              'px-2 py-2': collapsed,
              'px-4 py-3': !collapsed,
            })}
          >
            {collapsed ? (
              <div className="flex justify-center">
                {loginOut}
              </div>
            ) : (
              <div className="flex items-center gap-3 justify-between w-full">
                <Popover content={user?.email || t('common.user')}>
                  <Avatar
                    src="https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg"
                    size="small"
                  />
                </Popover>
                {loginOut}
              </div>
            )}
          </div>
        )}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        fixSiderbar
        layout="mix"
        token={{
          header: {
            colorBgHeader: '#001529',
            colorHeaderTitle: '#fff',
            colorTextMenu: '#fff',
            colorTextMenuSecondary: '#fff',
            colorTextMenuSelected: '#1890ff',
            colorBgMenuItemSelected: '#112240',
          },
          sider: {
            colorMenuBackground: '#001529',
            colorTextMenu: '#fff',
            colorTextMenuItemHover: '#1890ff',
            colorTextMenuSelected: '#1890ff',
            colorBgMenuItemSelected: '#112240',
          },
        }}
      >
        <PageContainer breadcrumb={{}} header={{ title: false }}>
          <Outlet />
        </PageContainer>
      </ProLayout>
    </ConfigProvider>
  )
}

