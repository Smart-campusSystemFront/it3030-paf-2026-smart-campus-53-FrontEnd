import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App as AntdApp, ConfigProvider } from 'antd'
import enUS from 'antd/locale/en_US'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      locale={enUS}
      theme={{
        token: {
          /* ── Brand colours ── */
          colorPrimary:         '#0091FF',
          colorInfo:            '#0091FF',
          colorSuccess:         '#10b981',
          colorWarning:         '#F9BF3B',
          colorError:           '#ef4444',

          /* ── Typography ── */
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize:   14,
          fontSizeLG: 15,

          /* ── Layout ── */
          borderRadius:   8,
          borderRadiusLG: 12,
          borderRadiusSM: 6,

          /* ── Surfaces ── */
          colorBgBase:       '#ffffff',
          colorBgLayout:     '#f0f4f8',
          colorBgContainer:  '#ffffff',
          colorBgElevated:   '#ffffff',

          /* ── Borders ── */
          colorBorderSecondary: '#dde3ed',
          colorBorder:          '#c2cad8',

          /* ── Behaviour ── */
          motionDurationMid: '0.18s',
          motionEaseOut:     'cubic-bezier(.25,.46,.45,.94)',

          /* ── Shadows ── */
          boxShadow:    '0 1px 3px 0 rgb(0 32 91/.08),0 1px 2px -1px rgb(0 32 91/.06)',
          boxShadowSecondary: '0 4px 16px 0 rgb(0 32 91/.1),0 2px 6px -2px rgb(0 32 91/.06)',
        },
        components: {
          Layout: {
            siderBg:      '#001845',
            headerBg:     '#ffffff',
            bodyBg:       '#f0f4f8',
          },
          Menu: {
            darkItemBg:          '#001845',
            darkItemSelectedBg:  'rgba(0,145,255,.12)',
            darkItemColor:       '#c9cedc',
            darkItemSelectedColor: '#0091FF',
            darkItemHoverColor:  '#ffffff',
            darkItemHoverBg:     'rgba(0,145,255,.07)',
            itemBorderRadius:    8,
          },
          Button: {
            primaryShadow: '0 4px 12px rgb(0 145 255/.30)',
            defaultBorderColor: '#dde3ed',
          },
          Input: {
            activeShadow: '0 0 0 3px rgb(0 145 255/.18)',
          },
          Table: {
            headerBg:     '#f8fafc',
            headerColor:  '#343E43',
            rowHoverBg:   '#e6f4ff',
          },
          Card: {
            headerBg: 'transparent',
          },
          Tag: {
            borderRadiusSM: 6,
          },
        },
      }}
    >
      <AntdApp>
        <App />
      </AntdApp>
    </ConfigProvider>
  </StrictMode>,
)
