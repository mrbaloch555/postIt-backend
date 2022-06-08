const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const profileRoute = require("./profile.route");
const adminRoute = require("./admin.route");
const postRoute = require("./post.route");
const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/admin",
    route: adminRoute,
  },
  {
    path: "/profiles",
    route: profileRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
