var compression = require("compression");

module.exports = (app) => {
  app.use(
    compression({
      filter: (req, res) => {
        if (req.headers["no-compression"]) {
          // don't compress responses with this request header
          return false;
        }
        return req, res;
      },
    })
  );
};
