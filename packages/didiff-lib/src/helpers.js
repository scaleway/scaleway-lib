import fs from 'fs'
import nodePath from 'path'
import { PNG } from 'pngjs'

function removeFile(path) {
  fs.unlinkSync(path)
}
function removeFiles(paths = []) {
  paths.forEach(path => removeFile(path))
}
function getFile(path) {
  return fs.readFileSync(path)
}
function toPNG(data) {
  return PNG.sync.read(data)
}
function createPNG(path, data) {
  fs.writeFileSync(path, PNG.sync.write(data))
}
function getImageData(path) {
  const image = getFile(path)
  const png = toPNG(image)
  return { image, png }
}
function getImageInformations({ url = '', pathname = '', name = '' }) {
  const nameWithExtension = `${name}.png`
  const fullName = `${pathname}-${nameWithExtension}`
  const fsPath = `${nodePath.resolve(__dirname, './screenshots')}`

  return {
    url,
    name,
    fullName,
    fullPath: `${fsPath}/${fullName}`,
    path: `${fsPath}/${pathname}`,
  }
}
function getPathnameFromUrl(url = '') {
  const urlParts = url.split('/').filter(Boolean)
  const langIndex = urlParts.findIndex(v => v === 'en' || v === 'fr') + 1
  return urlParts.slice(langIndex, urlParts.length).join('!') || 'home'
}

export {
  createPNG,
  getFile,
  getImageData,
  getImageInformations,
  getPathnameFromUrl,
  removeFiles,
}
