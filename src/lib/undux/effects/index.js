import { compose } from 'lodash/fp'

// import withBalanceChange from './balanceChange'
import withProfile from './profile'

export default compose(
  //eslint-disable-next-line
  // withBalanceChange,
  withProfile,
)
