import { Box, RichSelect } from '@scaleway/ui'
import { useI18n } from '@scaleway/use-i18n'
import React, { memo } from 'react'
import deFlag from './assets/flags/de.svg'
import frFlag from './assets/flags/fr.svg'
import enFlag from './assets/flags/uk.svg'
import unknown from './assets/flags/unknown.svg'

const images = {
  fr: frFlag,
  en: enFlag,
  de: deFlag,
}

const customSelectStyle = state => ({
  singleValue: {
    marginTop: '0px',
  },
  option: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  valueContainer: {
    maxHeight: state?.selectProps?.inputValue !== '' ? '16px' : 'inherit',
  },
  control: {
    cursor: 'pointer',
  },
})

// eslint-disable-next-line react/prop-types
const Label = ({ locale }) => (
  <Box display="flex" alignItems="center" justifyContent="start" width={80}>
    <Box
      position="relative"
      mr={1}
      width={20}
      maxHeight={20}
      display="inline-flex"
    >
      <img src={images[locale] || unknown} alt={locale} />
    </Box>
    <Box position="relative" display="inline-flex" textTransform="uppercase">
      {locale}
    </Box>
  </Box>
)

const LocaleSwitcher = memo(() => {
  const { switchLocale, currentLocale, locales } = useI18n()

  return (
    <RichSelect
      name="locale-switcher"
      // display="flex"
      // m={2}
      margin="10px"
      width="10rem"
      customStyle={customSelectStyle}
      noTopLabel
      isSearchable={false}
      value={{
        value: currentLocale,
        label: <Label locale={currentLocale} />,
      }}
      onChange={({ value }) => switchLocale(value)}
    >
      {locales.map(locale => {
        const filteredLocale = locale.substring(0, 2)

        return (
          <RichSelect.Option value={filteredLocale} key={locale}>
            <Label locale={filteredLocale} />
          </RichSelect.Option>
        )
      })}
    </RichSelect>
  )
})

export default LocaleSwitcher
