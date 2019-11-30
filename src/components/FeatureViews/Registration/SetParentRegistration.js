import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";

// Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import NewUser from "@material-ui/icons/PersonAdd";
import NewTutor from "@material-ui/icons/Group";
import NewCourse from "@material-ui/icons/School";
import { NavLink } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles } from "@material-ui/styles";
import "./registration.scss";
import ListItemText from "@material-ui/core/ListItemText";
import AssignmentIcon from "@material-ui/icons/Assignment";
import SelectParentDialog from "./SelectParentDialog";
import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import {connect} from "react-redux";
import {stringToColor} from "../Accounts/accountUtils";

const useStyles = makeStyles({
    setParent: {
        backgroundColor:"#39A1C2",
        color: "white",
        // padding: "",
    }
})

function SetRegistrationActions(props) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [dialogOpen, setDialog] = useState(false);
    const classes = useStyles();

    const handleClick = () => (e) => {
        e.preventDefault();

        setDialog(true);
    }

    const closeDialog = () => {
        setDialog(false);
    }

    function handleClose() {
        setAnchorEl(null);
    }

    useEffect(()=>{
        props.registrationActions.initializeRegistration();
    },[]);

    return (
        <Grid item xs={2}>
            {
               props.registration.CurrentParent ?
                    <Button className={"button"} onClick={handleClick()}>
                        <div className={"circle-icon"} style={{backgroundColor:stringToColor(props.registration.CurrentParent.user.name)}} />
                        {props.registration.CurrentParent.user.name}
                    </Button> :
                    <Button className={`button set-parent`} onClick={handleClick()}>
                        <div className={"circle-icon"}/>
                        SET PARENT
                    </Button>
            }
            <SelectParentDialog open={dialogOpen} onClose={closeDialog}/>
        </Grid>
    );
}

SetRegistrationActions.propTypes = {
    courseTitle: PropTypes.string,
    admin: PropTypes.bool,
};
const mapStateToProps = (state) => ({
    "registration": state.Registration,
});

const mapDispatchToProps = (dispatch) => ({
    "registrationActions": bindActionCreators(registrationActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SetRegistrationActions);