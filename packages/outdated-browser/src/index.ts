import { content, style } from './content'

declare const SUPPORTED_BROWSERS: string

const STORAGE_KEY = '__outdated'
const ignore = sessionStorage.getItem(STORAGE_KEY) || 'false'

declare global {
  // oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    closeOutdated: () => void
  }
}

if (
  SUPPORTED_BROWSERS &&
  !new RegExp(SUPPORTED_BROWSERS).test(navigator.userAgent) &&
  ignore === 'false'
) {
  const styleElement = document.createElement('style')
  styleElement.innerHTML = style
  document.head.append(styleElement)

  const element = document.createElement('div')
  element.setAttribute('id', 'outdated')
  element.innerHTML = content
  document.body.prepend(element)

  window.closeOutdated = () => {
    element.remove()
    sessionStorage.setItem(STORAGE_KEY, 'true')
  }
}
