const mlist = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec"
];

export const getDate = dateFromDb => {
  var date = new Date(dateFromDb);
  return (
    mlist[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()
  );
};

export const getDay = dateFromDb => {
  var dateInMsNow = new Date();
  var dateInMs = new Date(dateFromDb);
  var dayNow = dateInMsNow.getDate(dateInMsNow.getTime());
  var day = dateInMs.getDate();
  if (dayNow === day) {
    return "Today";
  } else if (dayNow - day === 1) {
    return "Yesterday";
  } else {
    return day + " " + mlist[dateInMs.getMonth()];
  }
};

export const getTime = dateFromDb => {
  var date = new Date(dateFromDb);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  return hours + "." + minutes;
};

export const messagesTime = dateFromDb => {
  var dateNow = new Date();
  var dayNow = dateNow.getDate(dateNow.getTime());
  var messageDate = new Date(dateFromDb);
  var day = messageDate.getDate();
  let hours = messageDate.getHours();
  let minutes = messageDate.getMinutes();
  if (dayNow === day) {
    return `Today at ${hours}.${minutes}`;
  } else if (dayNow - day === 1) {
    return `Yesterday ${hours}.${minutes}`;
  } else {
    return (
      day + " " + mlist[messageDate.getMonth()] + " at " + `${hours}.${minutes}`
    );
  }
};

export const getNumber = number => {
  if (number < 1000) {
    return number;
  } else if (number > 1000) {
    return ("" + number)[0] + "k";
  } else if (number > 10000) {
    return ("" + number)[0] + ("" + number)[1] + "k";
  }
};
