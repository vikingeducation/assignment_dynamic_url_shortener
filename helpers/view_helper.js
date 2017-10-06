var ViewHelper = {};

ViewHelper.formatShort = (string) => {
  string = string.slice(6);
  return string;
};

module.exports = ViewHelper;
