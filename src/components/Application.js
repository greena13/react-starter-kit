import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';

class Application extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;

    return (
      <div>
        <Helmet title='React Starter Kit' />

        <div>
          {children}
        </div>
      </div>
    );
  }
}

Application.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)]),
  fetchUserSession: PropTypes.func
};

module.exports = Application;
