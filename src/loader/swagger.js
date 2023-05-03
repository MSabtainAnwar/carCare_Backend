const swaggerUI = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
const config = require("../config/config");

const port = config.port;

module.exports = function (app) {
  //declaring swagger docs
  const options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: "CarCare App 🚛",
        version: "1.0.0",
        description: "NodeJs App!",
      },
      servers: [
        {
          url: `http://localhost:${port}`,
        },
      ],
    },
    apis: ["./src/routes/*.js"],
  };
  const specs = swaggerJSDoc(options);
  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(specs, {
      swaggerOptions: {
        // docExpansion: "none",
      },
    })
  );
};
