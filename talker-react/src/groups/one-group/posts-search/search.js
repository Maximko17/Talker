import React, { Component } from "react";
import "./search.css";

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      search_mode: false
    };
    this.changeMode = this.changeMode.bind(this);
    this.claearInput = this.claearInput.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    const { initialState } = this.props;
    this.setState({
      search_mode: initialState
    });
  }

  changeMode() {
    this.setState({
      search_mode: true
    });
  }

  claearInput() {
    this.setState(
      {
        input: ""
      },
      () => this.props.searchAction("")
    );
  }

  onChange(e) {
    this.setState(
      {
        input: e.target.value
      },
      () => this.props.searchAction(this.state.input)
    );
  }
  render() {
    let { search_mode, input } = this.state;
    const { placeholder } = this.props;
    if (search_mode) {
      return (
        <form className="post-search">
          <button type="button" className="search-button">
            <i className="fas fa-search"></i>
          </button>
          <input
            type="text"
            value={input}
            placeholder={placeholder}
            onChange={this.onChange}
          />
          <button
            type="button"
            className={input != "" ? "clear" : "clear-hidden"}
            onClick={this.claearInput}
          >
            <i className="fas fa-times"></i>
          </button>
        </form>
      );
    } else {
      return (
        <div className="post-search">
          <div className="tab">Group Posts</div>
          <button
            type="button"
            className="search-button"
            onClick={this.changeMode}
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
      );
    }
  }
}
