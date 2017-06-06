import React from 'react';
import Header from '../components/common/header/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Utils from '../components/common/Utils';
import * as UserActions from '../actions/userActions';

export function Billing(props) {
  return (
    <div className="qnote-wrap billing">
      <div className="billing-container">
        <Header className="header" disable />
        <div className="wrapper">
          <div className="upgrade">
            <img src="/ns/dist/images/upgrade.png" />
          </div>
        </div>
        <div className="billing-footer">
          <div>{"服務條款"}</div>
          <div>{"隱私權政策"}</div>
          <div>{"版權所有 2015 NotesStation Corporation"}</div>
        </div>
      </div>
      <Utils {...props} />
    </div>
  );
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      user: bindActionCreators(UserActions, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Billing);
