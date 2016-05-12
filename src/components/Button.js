import React from 'react';
const {PropTypes} = React;

import ButtonColors from '../constants/ButtonColors';
import style from './Button.less';

const Button = ({color, onClick}) => {
  const className = color === ButtonColors.RED ? style.red : style.blue;

  const toggleColor = () => {
    onClick(color === ButtonColors.RED ? ButtonColors.BLUE : ButtonColors.RED);
  };

  return(
    <div className={className} onClick={toggleColor}>
      {color} button
    </div>
  );
};

Button.propTypes = {
  color: PropTypes.string,
  onClick: PropTypes.func
};

module.exports = Button;
