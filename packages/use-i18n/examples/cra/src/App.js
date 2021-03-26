import { Link } from '@scaleway/ui'
import { useTranslation } from '@scaleway/use-i18n'
import React, { memo } from 'react'
import LocalSwitcher from './LocaleSwitcher'
import './App.css'

const App = memo(() => {
  const { t } = useTranslation(['common'])

  return (
    <div className="App">
      <header className="App-header">
        <p>{t('common.title')}</p>
        <Link to="https://console.scaleway.com" mb={1}>
          {t('common.learning.i18n')}
        </Link>
        <p>{t('common.only.english')}</p>
        <LocalSwitcher />
      </header>
    </div>
  )
})
export default App
