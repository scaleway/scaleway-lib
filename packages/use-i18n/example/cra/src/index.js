import React from 'react'
import ReactDOM from 'react-dom'
import I18n from '@scaleway/use-i18n'
import './index.css'
import App from './App'
import en from './locales/en/index.js'
import reportWebVitals from './reportWebVitals'

const enableDefaultLocal = false
const defaultLocale = 'en'
const defaultLocales = ['en', 'fr']
const defaultTranslations = en

ReactDOM.render(
  <React.StrictMode>
    <I18n
      enableDefaultLocal={enableDefaultLocal}
      defaultLocale={defaultLocale}
      defaultLocales={defaultLocales}
      defaultTranslations={defaultTranslations}
    >
      <App />
    </I18n>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
