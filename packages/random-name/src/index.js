import dockerNames from 'docker-names'

const randomName = (prefix = '', separator = '-') => {
  let random = dockerNames.getRandomName().replace(/_/g, separator)
  while (random.includes('cocks')) {
    random = dockerNames.getRandomName().replace(/_/g, separator)
  }
  return prefix.length > 0 ? `${prefix}${separator}${random}` : random
}

export default randomName
