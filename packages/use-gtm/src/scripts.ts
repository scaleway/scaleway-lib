import type { GTMEnvironment } from './types'

export const DATALAYER_NAME = 'dataLayer'
export const LOAD_ERROR_EVENT = 'gtm_loading_error'

const flattenEnvironment = (environment?: GTMEnvironment) =>
  environment?.auth
    ? `&${Object.entries({ ...environment, cookies_win: 'x' })
        .filter(([, value]) => !!value)
        .map(([key, value]) => `gtm_${key}=${value}`, '')
        .join('&')}`
    : ''

const generateSnippets = (id: string, environment?: GTMEnvironment) => {
  const env = flattenEnvironment(environment)

  return {
    dataLayerInit: `window.${DATALAYER_NAME} = window.${DATALAYER_NAME} || [];`,
    noScript: `<iframe src="https://www.googletagmanager.com/ns.html?id=${id}${env}" height="0" width="0" style="display:none;visibility:hidden" id="tag-manager"></iframe>`,
    script: `(function(w,d,s,l,i){w[l]=w[l]||[];
    w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+'${env}';

    j.addEventListener('error', function() {
        var _ge = new CustomEvent('${LOAD_ERROR_EVENT}', { bubbles: true });
        d.dispatchEvent(_ge);
    });

    f.parentNode.insertBefore(j,f);
  })(window,document,'script','${DATALAYER_NAME}','${id}');`,
  }
}

const generateScripts = (id: string, environment?: GTMEnvironment) => {
  const {
    dataLayerInit: dataLayerInitSnippet,
    noScript: noScriptSnippet,
    script: scriptSnippet,
  } = generateSnippets(id, environment)

  const dataLayerInit = document.createElement('script')
  dataLayerInit.innerHTML = dataLayerInitSnippet
  const noScript = document.createElement('noscript')
  noScript.innerHTML = noScriptSnippet
  const script = document.createElement('script')
  script.innerHTML = scriptSnippet

  return {
    dataLayerInit,
    noScript,
    script,
  }
}

export default generateScripts
