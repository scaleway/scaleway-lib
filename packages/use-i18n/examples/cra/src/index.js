import { ThemeProvider } from '@emotion/react'
import { GlobalStyle, theme } from '@scaleway/ui'
import I18n from '@scaleway/use-i18n'
import React from 'react'
import { render } from 'react-dom'
import './index.css'
import App from './App'

const load = async ({ locale, namespace }) =>
  import(`./locales/${locale}/${namespace}.json`)

render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <I18n
        defaultLoad={load}
        defaultLocale="fr"
        enableDefaultLocal={false}
        supportedLocales={['en', 'fr', 'de']}
      >
        <App />
      </I18n>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
