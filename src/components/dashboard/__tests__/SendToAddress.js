import React from 'react'

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer'

import { getWebRouterComponentWithMocks } from './__util__'

describe('SendToAddress', () => {
  it('renders without errors', () => {
    const SendToAddress = getWebRouterComponentWithMocks('../SendToAddress')
    const tree = renderer.create(<SendToAddress />)
    expect(tree.toJSON()).toBeTruthy()
  })

  it('matches snapshot', () => {
    const SendToAddress = getWebRouterComponentWithMocks('../SendToAddress')
    const component = renderer.create(<SendToAddress />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})
