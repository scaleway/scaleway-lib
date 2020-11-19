// __mocks__/lookpath.js

const lookpath = jest.createMockFromModule('lookpath')

function lp() {
  return 'undefined'
}

lookpath.lookpath = lp

module.exports = lookpath
