import React from "react";
import PropTypes from "prop-types";
import {Redirect, Route} from "react-router-dom";
import {useLoginStatus} from "../Authentication/utils";

const ProtectedRoute = ({component, render, ...rest}) => {
    const isLoggedIn = useLoginStatus();

    // eslint-disable-next-line react/no-multi-comp
    const renderRoute = () => isLoggedIn
        ? component || (render && render(rest))
        : <Redirect
            push
            to="/login" />;
    return (
        <Route
            {...rest}
            render={renderRoute} />
    );
};

ProtectedRoute.propTypes = {
    "component": PropTypes.any,
    "render": PropTypes.func,
};

export default ProtectedRoute;
