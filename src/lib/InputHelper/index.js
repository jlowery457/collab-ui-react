import React from 'react';
import PropTypes from 'prop-types';

/**
 * @category controls
 * @component input
 * @variations collab-ui-react
 */

const InputHelper = ({ message, className }) => {
  return <p className={`cui-input__help-text ${className}`}>{message}</p>;
};

InputHelper.defaultProps = {
  className: '',
};

InputHelper.propTypes = {
  /** Message for parent input */
  message: PropTypes.string.isRequired,
  /** HTML Class for associated paragraph */
  className: PropTypes.string,
};

InputHelper.displayName = 'InputHelper';

export default InputHelper;

/**
* @name Input Helper
* @description Inputs are useful.
*
* @category controls
* @component input
* @section Input Helper
*
* @js

import {
  Checkbox,
  InputHelper
} from '@collab-ui/react';

export default function Default() {
  return (
    <div className='row'>
      <Checkbox
        value='us'
        label='us'
        htmlId='inputHelper1'
        onChange={()=>{}}
      >
        <InputHelper message={'I\'m here to help'} />
      </Checkbox>
    </div>
  );
}

**/
