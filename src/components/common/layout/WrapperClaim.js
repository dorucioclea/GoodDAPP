// @flow
import React, { useMemo } from 'react'
import { View } from 'react-native'
import { isMobileOnly } from 'mobile-device-detect'
import { withStyles } from '../../../lib/styles'
import { theme } from '../../../components/theme/styles'
import SimpleStore from '../../../lib/undux/SimpleStore'
import { getDesignRelativeHeight } from '../../../lib/utils/sizes'

const backgroundGradientStyles = {
  position: 'absolute',
  width: '180%',
  height: getDesignRelativeHeight(415),
  borderBottomLeftRadius: '50%',
  borderBottomRightRadius: '50%',
  left: '-40%',
  background: theme.colors.primary,
}

const WrapperClaim = ({ backgroundColor, children, style, styles, ...props }) => {
  const { container } = styles
  const simpleStore = SimpleStore.useStore()
  const shouldGrow = !simpleStore.get('isMobileSafariKeyboardShown')

  const wrapperStyles = useMemo(() => {
    const growStyle = { flexGrow: shouldGrow ? 1 : 0 }
    const backgroundStyle = backgroundColor ? { backgroundColor } : {}

    return [container, backgroundStyle, growStyle, style]
  }, [shouldGrow, backgroundColor, container, style])

  return (
    <View data-name="viewWrapper" style={wrapperStyles} {...props}>
      {!backgroundColor && <View style={backgroundGradientStyles} />}
      {children}
    </View>
  )
}

const getStylesFromProps = ({ theme }) => {
  let styles = {
    container: {
      width: '100%',
      position: 'relative',
    },
  }
  if (!isMobileOnly) {
    styles.container = { ...styles.container }
  }
  return styles
}

export default withStyles(getStylesFromProps)(WrapperClaim)
