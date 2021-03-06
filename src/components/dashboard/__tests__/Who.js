import React from 'react'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import { getWebRouterComponentWithMocks } from './__util__'

describe('Who', () => {
  it('renders without errors', () => {
    const Who = getWebRouterComponentWithMocks('../Who')
    const tree = renderer.create(<Who />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot', () => {
    const Who = getWebRouterComponentWithMocks('../Who')
    const component = renderer.create(<Who />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
