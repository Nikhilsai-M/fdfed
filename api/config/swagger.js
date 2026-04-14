import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Exchange API",
      version: "1.0.0",
      description:
        "REST API documentation for Smart Exchange covering B2C storefront flows and B2B-style partner/admin operations.",
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        accessTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "access_token",
        },
        adminTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "admin_access_token",
        },
        supervisorTokenCookie: {
          type: "apiKey",
          in: "cookie",
          name: "supervisor_access_token",
        },
      },
    },
  },
  apis: ["./routes/**/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
