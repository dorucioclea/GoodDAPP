// @flow
import { isBrowser, isTablet } from '../utils/platform'

import { getScreenHeight, getScreenWidth } from './orientation'

const height = getScreenHeight()
const width = getScreenWidth()

const DESIGN_WIDTH = 360
const DESIGN_HEIGHT = 640 - 24

const MAX_WIDTH = 475
const MAX_HEIGHT = 788 //without topbar which is 56

const isDesktopOrTablet = isBrowser || isTablet

const windowHeight = isDesktopOrTablet && height > MAX_HEIGHT ? MAX_HEIGHT : height
const windowWidth = isDesktopOrTablet && width > MAX_WIDTH ? MAX_WIDTH : width

const CURRENT_RESOLUTION = Math.sqrt(windowHeight * windowHeight + windowWidth * windowWidth)
const DESIGN_RESOLUTION = Math.sqrt(DESIGN_HEIGHT * DESIGN_HEIGHT + DESIGN_WIDTH * DESIGN_WIDTH)

const RESOLUTIONS_PROPORTION = CURRENT_RESOLUTION / DESIGN_RESOLUTION

function normalizeText(size) {
  let normalizedSize = size

  if (RESOLUTIONS_PROPORTION < 1 && size > 16) {
    normalizedSize *= RESOLUTIONS_PROPORTION
  }

  return normalizedSize
}

export default normalizeText
