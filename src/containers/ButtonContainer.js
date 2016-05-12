import { connect } from 'react-redux';

import Button from '../components/Button';
import ButtonActions from '../store/actions/ButtonActions';

function mapStateToProps( { button }) {
  return button;
}

function mapDispatchToProps(dispatch) {
  return {
    onClick: (newColor) => {
      dispatch(ButtonActions.click(newColor));
    }
  };
}

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(Button);

