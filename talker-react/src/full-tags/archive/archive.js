import React, { Component } from "react";
import "./archive.css";

class Archive extends Component {
  state = {
    year: "",
    years: [2012, 2015, 2019],
    month: "",
    months: ["January", "February", "March"],
    day: "",
    days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  };

  getAll() {
    return this.setState({
      year: "",
      month: "",
      day: ""
    });
  }

  getYear() {
    const { year, years } = this.state;
    if (year !== "") {
      return (
        <button>
          {year} <i className="fas fa-chevron-right" />
        </button>
      );
    } else {
      return years.map(year => {
        return (
          <button onClick={() => this.setState({ year })} key={year}>
            {year}
          </button>
        );
      });
    }
  }

  getMonth() {
    const { year, month, months } = this.state;
    if (year !== "") {
      if (month !== "") {
        return (
          <button>
            {month} <i className="fas fa-chevron-right" />
          </button>
        );
      } else {
        return months.map(month => {
          return (
            <button onClick={() => this.setState({ month })} key={month}>
              {month}
            </button>
          );
        });
      }
    }
  }

  getDay() {
    const { year, month, day, days } = this.state;
    if (year !== "" && month !== "") {
      if (day !== "") {
        let new_days = [];
        days.map((map_day, i) => {
          if (map_day === day) {
            new_days.push(
              <button className="active-day" key={i}>
                {map_day}
              </button>
            );
          } else {
            new_days.push(
              <button onClick={() => this.setState({ day: map_day })} key={i}>
                {map_day}
              </button>
            );
          }
        });
        return new_days;
      } else {
        return days.map(day => {
          return (
            <button onClick={() => this.setState({ day })} key={day}>
              {day}
            </button>
          );
        });
      }
    }
  }

  render() {
    const { changeSort, current_sort_name } = this.props;
    return (
      <div className="archive-dates">
        <div className="archive-all">
          <button onClick={() => this.getAll()}>
            All <i className="fas fa-chevron-right" />
          </button>
        </div>
        <div className="archive-year-months-days">
          <div>{this.getYear()}</div>
          <div>{this.getMonth()}</div>
          <div>{this.getDay()}</div>
        </div>
        <div className="sort">
          <button
            type="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
            style={{ background: "white" }}
          >
            {current_sort_name + " "}
            <i className="fas fa-chevron-down" />
          </button>
          <div className="dropdown-menu">
            <button
              onClick={() =>
                changeSort("Sort by most popular", "totalLikes", "desc")
              }
            >
              Sort by most popular
            </button>
            <button
              onClick={() => changeSort("Sort by oldest", "postDate", "asc")}
            >
              Sort by oldest
            </button>
            <button
              onClick={() => changeSort("Sort by latest", "postDate", "desc")}
            >
              Sort by latest
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Archive;
