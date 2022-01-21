import React from "react";
import { Switch } from "react-router-dom";

import SignIn from "../Pages/Signin";
import SignUp from "../Pages/SignUp";
import Dashboard from "../Pages/Dashboard";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";
import Profile from "../Pages/Profile";

import Route from "./Route";


const Routes: React.FC = () => (
    <Switch>
        <Route path='/' exact component={SignIn} />
        <Route path='/signup' exact component={SignUp} />
        <Route path="/dashboard" component={Dashboard} isPrivate />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/profile" component={Profile} isPrivate />
    </Switch>
);

export default Routes;