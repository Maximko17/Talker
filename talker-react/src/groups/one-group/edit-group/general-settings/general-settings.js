import React, { Component } from "react";
import "./general-settings.css";
import Banner from "./banner/banner";
import General from "./general/general";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  getEditGroupInfo,
  editGroup,
  saveBanner
} from "../../../../actions/group-actions";

class GeneralSettings extends Component {
  render() {
    const { group, editGroup, saveBanner } = this.props;
    return (
      <React.Fragment>
        <General group={group} editGroup={editGroup} />
        <Banner
          banner={group.banner}
          saveBanner={saveBanner}
          groupUri={group.uri}
        />
      </React.Fragment>
    );
  }
}

GeneralSettings.propTypes = {
  getEditGroupInfo: PropTypes.func.isRequired,
  saveBanner: PropTypes.func.isRequired,
  editGroup: PropTypes.func.isRequired,
  error: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  security: state.security,
  error: state.errors.error
});
export default connect(
  mapStateToProps,
  { getEditGroupInfo, editGroup, saveBanner }
)(GeneralSettings);
