// @flow
import React, { useCallback } from 'react'
import { AsyncStorage } from 'react-native'

import logger from '../logger/pino-logger'
import IconWrapper from '../../components/common/modal/IconWrapper'
import LoadingIcon from '../../components/common/modal/LoadingIcon'

import retryImport from '../utils/retryImport'

const log = logger.child({ from: 'useDeleteAccountDialog' })

export default ({ API, showDialog, store, theme }) =>
  useCallback(
    () =>
      showDialog('', '', {
        title: 'ARE YOU SURE?',
        message: 'If you delete your wallet',
        boldMessage: 'all your G$ will be lost forever!',
        image: <IconWrapper iconName="trash" color={theme.colors.error} size={50} />,
        buttons: [
          { text: 'Cancel', onPress: dismiss => dismiss(), mode: 'text', color: theme.colors.lighterGray },
          {
            text: 'Delete',
            color: theme.colors.red,
            onPress: async () => {
              showDialog('', '', {
                title: 'ARE YOU SURE?',
                message: 'If you delete your wallet',
                boldMessage: 'all your G$ will be lost forever!',
                image: <LoadingIcon />,
                showButtons: false,
              })
              try {
                const userStorage = await retryImport(() => import('../gundb/UserStorage')).then(_ => _.default)

                let token = await userStorage.getProfileFieldValue('w3Token')

                if (!token) {
                  token = await userStorage.getProfileFieldValue('loginToken')
                }

                const isDeleted = await userStorage.deleteAccount()
                log.debug('deleted account', isDeleted)

                if (isDeleted) {
                  API.deleteWalletFromW3Site(token)
                  await Promise.all([AsyncStorage.clear()])
                  window.location = '/'
                } else {
                  showDialog('There was a problem deleting your account. Try again later.')
                }
              } catch (e) {
                log.error('Error deleting account', e.message, e)
                showDialog('There was a problem deleting your account. Try again later.')
              }
            },
          },
        ],
      }),
    [API, showDialog, store, theme]
  )