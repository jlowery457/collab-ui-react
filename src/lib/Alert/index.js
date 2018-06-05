import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Icon
} from '@collab-ui/react';

/**
 * @category communication
 * @component alert
 * @variations collab-ui-react
 */

const Alert = props => {
  const { show, onHide, type, closable,  title, message } = props;

  return (
    show && (
      <div className={`cui-alert cui-alert--${type}`}>
        <div className='cui-alert__icon' />
        <div className={'cui-alert__content'}>
          <div className='cui-alert__title'>{title}</div>
          <div className='cui-alert__message'>{message}</div>
        </div>
        {closable &&
          <div className='cui-alert__button'>
            <Button
              children={<Icon name='cancel_16' />}
              onClick={onHide}
              ariaLabel='close'
              circle
              large
            />
          </div>
        }
      </div>
    )
  );
};

Alert.defaultProps = {
  title: '',
  message: '',
  type: 'info',
  closable: false,
  onHide: null,
};

Alert.propTypes = {
  /**
   * optional Alert Title
   */
  title: PropTypes.string,
  /**
   * optional Alert Message
   */
  message: PropTypes.string,
  /**
   * show/hide Alert.
   */
  show: PropTypes.bool.isRequired,
  /**
   * size of the Alert.
   */
  type: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  /**
   * callback function invoked on close of the Alert. Alert can be closed on click of cross button or esc key.
   * onHide is mandatory props, if not passed Alert can not be closed.
   */
  onHide: PropTypes.func,
  /**
   *  To show/hide Close CTA of the Alert.
   */
  closable: PropTypes.bool,
};

Alert.displayName = 'Alert';

export default Alert;

/**
* @name Alerts
* @description Create the type of Alert (info, success, warning, or error) by passing in the type prop.
*
* @category communication
* @component alert
* @section default
*
* @js

import {
  Button,
  AlertContainer
} from '@collab-ui/react';

export default class Default extends React.PureComponent {
  state = {
    alertMessage: 'Who\'s awesome?  You are!'
  }

  render() {
    let alertContainer;
    return (
      <section>
        <div>
          <div className='row'>
            <Button
              ariaLabel='Click to Open'
              onClick={() => alertContainer.info(
                'Alert',
                this.state.alertMessage,
                () => console.log('onHide info')
              )}
              children='Info/Default'
              color='primary'
              size='large'
            />
          </div>
          <div className='row'>
            <br />
            <Button
              ariaLabel='Click to Open'
              onClick={() => alertContainer.success(
                'Alert',
                this.state.alertMessage,
                () => console.log('onHide info')
              )}
              children='Success'
              color='primary'
              size='large'
            />
          </div>
          <div className='row'>
            <br />
            <Button
              ariaLabel='Click to Open'
              onClick={() => alertContainer.warning(
                'Alert',
                this.state.alertMessage,
                () => console.log('onHide info')
              )}
              children='Warning'
              color='primary'
              size='large'
            />
          </div>
          <div className='row'>
            <br />
            <Button
              ariaLabel='Click to Open'
              onClick={() => alertContainer.error(
                'Alert',
                this.state.alertMessage,
                () => console.log('onHide info')
              )}
              children='Error'
              color='primary'
              size='large'
            />
          </div>
        </div>
        <br />
        <AlertContainer
          ref={ref => alertContainer = ref}
          orderNewest={false}
        />
      </section>
    );
  }
}

**/
