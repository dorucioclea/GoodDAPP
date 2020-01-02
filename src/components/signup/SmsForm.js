// @flow
import React from 'react'
import logger from '../../lib/logger/pino-logger'
import API from '../../lib/API/api'
import { getDesignRelativeHeight } from '../../lib/utils/sizes'
import { withStyles } from '../../lib/styles'
import SpinnerCheckMark from '../common/animations/SpinnerCheckMark'
import Section from '../common/layout/Section'
import ErrorText from '../common/form/ErrorText'
import OtpInput from '../common/form/OtpInput'
import CustomWrapper from './signUpWrapper'
import type { SignupState } from './SignupState'

const log = logger.child({ from: 'SmsForm' })

type Props = {
  phone: string,
  data: SignupState,
  doneCallback: ({ isPhoneVerified: boolean }) => null,
  screenProps: any,
}

export type SMSRecord = {
  smsValidated: boolean,
  sentSMS?: boolean,
}

type State = SMSRecord & {
  errorMessage: string,
  sendingCode: boolean,
  renderButton: boolean,
  resentCode: boolean,
  loading: boolean,
  otp: Array<string>,
}

const NumInputs: number = 6

class SmsForm extends React.Component<Props, State> {
  state = {
    smsValidated: false,
    sentSMS: false,
    errorMessage: '',
    sendingCode: false,
    renderButton: false,
    resentCode: false,
    loading: false,
    otp: Array(NumInputs).fill(null),
  }

  componentDidMount() {
    this.displayDelayedRenderButton()
  }

  componentDidUpdate() {
    if (!this.state.renderButton) {
      this.displayDelayedRenderButton()
    }
  }

  displayDelayedRenderButton = () => {
    setTimeout(() => {
      this.setState({ renderButton: true })
    }, 10000)
  }

  handleChange = async (otp: array) => {
    const otpValue = otp.filter(val => val).join('')
    if (otpValue.replace(/ /g, '').length === NumInputs) {
      this.setState({
        loading: true,
        otp,
      })
      try {
        await this.verifyOTP(otpValue)
        this.handleSubmit()
      } catch (e) {
        log.error('Verify otp failed', e.message, e)

        this.setState({
          errorMessage: e.message || e,
          loading: false,
        })
      }
    } else {
      this.setState({
        errorMessage: '',
        otp,
      })
    }
  }

  handleSubmit = async () => {
    await this.props.screenProps.doneCallback({ smsValidated: true })

    this.setState({ loading: false })
  }

  // eslint-disable-next-line class-methods-use-this
  verifyOTP(otp: string) {
    return API.verifyMobile({ otp })
  }

  handleRetry = async () => {
    this.setState({ sendingCode: true, otp: Array(NumInputs).fill(null), errorMessage: '' })
    let { retryFunctionName } = this.props.screenProps

    retryFunctionName = retryFunctionName || 'sendOTP'

    try {
      await API[retryFunctionName]({ ...this.props.screenProps.data })
      this.setState({ sendingCode: false, renderButton: false, resentCode: true }, this.displayDelayedRenderButton)

      //turn checkmark back into regular resend text
      setTimeout(() => this.setState({ ...this.state, resentCode: false }), 2000)
    } catch (e) {
      log.error('Resend sms code failed', e.message, e)
      this.setState({
        errorMessage: e.message || e,
        sendingCode: false,
        renderButton: true,
      })
    }
  }

  render() {
    const { errorMessage, otp, sendingCode, resentCode } = this.state
    const { styles } = this.props

    return (
      <CustomWrapper handleSubmit={this.handleSubmit} footerComponent={() => <React.Fragment />}>
        <Section grow justifyContent="flex-start">
          <Section.Stack justifyContent="flex-start" style={styles.container}>
            <Section.Row justifyContent="center">
              <Section.Title color="darkGray" fontSize={22} fontWeight="500" textTransform="none">
                {'Enter the verification code\nsent to your phone'}
              </Section.Title>
            </Section.Row>
            <Section.Stack justifyContent="center" style={styles.bottomContent}>
              <OtpInput
                shouldAutoFocus
                numInputs={NumInputs}
                onChange={this.handleChange}
                hasErrored={errorMessage !== ''}
                errorStyle={styles.errorStyle}
                value={otp}
                placeholder="*"
                isInputNum={true}
                aside={[3]}
              />
              <ErrorText error={errorMessage} />
            </Section.Stack>
          </Section.Stack>
          <Section.Row alignItems="center" justifyContent="center" style={styles.row}>
            <SMSAction
              sendingCode={sendingCode}
              resentCode={resentCode}
              handleRetry={this.handleRetry}
              successIconStyle={styles.successIconStyle}
            />
          </Section.Row>
        </Section>
      </CustomWrapper>
    )
  }
}

const SMSAction = ({ handleRetry, resentCode, sendingCode }) => (
  <SpinnerCheckMark loading={sendingCode} success={resentCode}>
    <Section.Text
      textDecorationLine="underline"
      fontWeight="medium"
      fontSize={14}
      color="primary"
      onPress={handleRetry}
    >
      Send me the code again
    </Section.Text>
  </SpinnerCheckMark>
)

const getStylesFromProps = ({ theme }) => ({
  informativeParagraph: {
    margin: '1em',
  },
  buttonWrapper: {
    alignContent: 'stretch',
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    justifyContent: 'center',
    width: '100%',
    height: 60,
  },
  row: {
    marginVertical: theme.sizes.defaultDouble,
  },
  errorStyle: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.red,
    color: theme.colors.red,
  },
  container: {
    minHeight: getDesignRelativeHeight(200),
    height: getDesignRelativeHeight(200),
  },
  bottomContent: {
    marginTop: 'auto',
    marginBottom: theme.sizes.defaultDouble,
  },
  successIconStyle: {
    borderWidth: 1,
    borderRadius: '50%',
    borderColor: theme.colors.primary,
    position: 'relative',
    height: 48,
    width: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default withStyles(getStylesFromProps)(SmsForm)
