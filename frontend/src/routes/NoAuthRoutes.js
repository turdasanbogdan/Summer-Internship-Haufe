import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AuthPage from "../pages/AuthPage";

const NoAuthRoutes = () => {
  return (
    <Switch class="container vh-100 d-flex justify-content-center">
      <Route path="/" exact component={AuthPage} />
      <Redirect to="/" />
    </Switch>
  );
};

export default NoAuthRoutes;
