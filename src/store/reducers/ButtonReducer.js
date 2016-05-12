import ButtonColors from '../../constants/ButtonColors';

const ButtonReducer = (state = { color: ButtonColors.BLUE}, action) => {
  if (action.type === 'CLICK') {
    return { color: action.color };
  } else {
    return state;
  }
};

module.exports = ButtonReducer;
