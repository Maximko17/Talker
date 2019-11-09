import React, { Component } from "react";
import "./groups-search.css";

class GroupsSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  clearSearch() {
    this.setState({
      search: ""
    });
  }

  onSubmit(e) {
    e.preventDeafault();
    //todo later
  }

  onChange(e) {
    this.setState({
      search: e.target.value
    });
  }

  render() {
    const { search } = this.state;
    return (
      <form onSubmit={this.onSubmit} className="group-search">
        <input
          type="input"
          placeholder="Groups search"
          value={search}
          onChange={this.onChange}
        />
        {search !== "" ? (
          <button
            type="button"
            className="group-search-clear"
            onClick={this.clearSearch}
          >
            <i className="fas fa-times"></i>
          </button>
        ) : null}
        <button type="submit" className="group-search-submit">
          <i className="fas fa-search"></i>
        </button>
      </form>
    );
  }
}
export default GroupsSearch;
