import { connect } from "react-redux";
import React, { Component } from "react";
import { Card, Paper, Typography } from "@material-ui/core";
import EmailIcon from "@material-ui/icons/EmailOutlined";
import PhoneIcon from "@material-ui/icons/PhoneOutlined";
import MoneyIcon from "@material-ui/icons/LocalAtmOutlined";
import EditIcon from "@material-ui/icons/EditOutlined";
import AwayIcon from "@material-ui/icons/EventBusy";
import { ReactComponent as IDIcon } from "../../identifier.svg";
import { ReactComponent as BirthdayIcon } from "../../birthday.svg";
import { ReactComponent as GradeIcon } from "../../grade.svg";
import { ReactComponent as SchoolIcon } from "../../school.svg";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Button from "@material-ui/core/Button";
import { NavLink } from "react-router-dom";
import { addDashes } from "./accountUtils";
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {DialogActions, DialogContent} from "@material-ui/core";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import OutOfOffice from "./OutOfOffice";
import './Accounts.scss';

class ProfileHeading extends Component {
    constructor(props) {
        super(props);
        this.state = {
           open:false,
        };
    }



    renderStudentProfile() {
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <IDIcon className="iconScaling" />
                    </Grid>

                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            #{this.props.user.summit_id ? this.props.user.summit_id : this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <BirthdayIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            {this.props.user.birthday}
                        </Typography>
                    </Grid>

                    <Grid item xs={1} md={1} className="rowPadding">
                        <GradeIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            Grade {this.props.user.grade}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <PhoneIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            {addDashes(this.props.user.phone_number)}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <SchoolIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            {this.props.user.school}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid item xs={5} md={5} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </Grid>);
    }

    renderTeacherProfile() {
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item md={1} className="rowPadding">
                        <IDIcon className="iconScaling" />
                    </Grid>
                    <Grid item md={11} className="rowPadding">
                        <Typography className="rowText">
                            #{this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid container>
                        <Grid item md={1} className="rowPadding">
                            <PhoneIcon className="iconScaling" />
                        </Grid>
                        <Grid item md={11} className="rowPadding">
                            <Typography className="rowText">
                                {addDashes(this.props.user.phone_number)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item md={1} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid item md={11} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                </Grid>
            </Grid>);
    }

    renderParentProfile() {
        return (
            <Grid item xs={12}>
                <Grid container>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <IDIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            #{this.props.user.user_id}
                        </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <MoneyIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            0
                            </Typography>
                    </Grid>
                    <Grid item xs={1} md={1} className="rowPadding">
                        <PhoneIcon className="iconScaling" />
                    </Grid>
                    <Grid item xs={5} md={5} className="rowPadding">
                        <Typography className="rowText">
                            {addDashes(this.props.user.phone_number)}
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={6} className="rowPadding">
                    </Grid>
                    <Grid item xs={1} md={1} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <EmailIcon />
                        </a>
                    </Grid>
                    <Grid item xs={5} md={5} className="emailPadding">
                        <a href={`mailto:${this.props.user.email}`}>
                            <Typography className="rowText" >
                                {this.props.user.email}
                            </Typography>
                        </a>
                    </Grid>
                    <Grid item xs={6} md={6} className="rowPadding">
                    </Grid>
                </Grid>
            </Grid>);
    }

    handleClose = () => {
        this.setState({
            "open": false
        });
    }

    renderEditandAwayButton() {
        if (this.props.user.role != "receptionist") {
            return (
                <>
                    <OutOfOffice
                        instructorID={this.props.user.role}
                        onClose={this.handleClose}
                        open={this.state.open} />
                <Grid container align="right" item md={9}>
                    <Grid item md={4} align= "right" className="editPadding">
                    <Button onClick={(e) => {
                                e.preventDefault();
                                this.handleOpen(e);
                            }}
                            className="editButton"
                            >
                                <AwayIcon/>
                    Add OOO
                    </Button>
                    </Grid>
                    <Grid item md={1}>
                    </Grid>
                    <Grid item md={4} align="right" component={Hidden} mdDown className="editPadding">
                        <Button
                            className="editButton"
                            component={NavLink}
                            to={`/registration/form/${this.props.user.role}/${this.props.user.user_id}/edit`}>
                            <EditIcon />
                            Edit Profile
                        </Button>
                    </Grid>
                    <Grid item md={4} align="right" component={Hidden} lgUp className="editPadding">
                        <Button
                            className="editButton"
                            component={NavLink}
                            to={`/registration/form/${this.props.user.role}/${this.props.user.user_id}/edit`}>
                            <EditIcon />
                        </Button>
                    </Grid>

                    </Grid>
                </>
            );
        }

    }

handleOpen(event){
    event.preventDefault();
    this.setState({open:true,})
}


    render() {
        let profileDetails;
        switch (this.props.user.role) {
            case "student":
                profileDetails = this.renderStudentProfile();
                break;
            case "instructor":
                profileDetails = this.renderTeacherProfile();
                break;
            case "parent":
                profileDetails = this.renderParentProfile();
                break;
            case "receptionist":
                profileDetails = this.renderTeacherProfile();
                break;
            default:
        }
        return (

            <div>
                <Grid container item xs={12} alignItems="center">
                    <Grid item xs={6} align="left">
                        <Grid container alignItems="center">

                            <h1 className="ProfileName">
                                {this.props.user.name}
                            </h1>
                            <div style={{ paddingLeft: 30 }}>
                                <Hidden smDown>
                                    <Chip
                                        className={`userLabel ${this.props.user.role}`}
                                        label={this.props.user.role.charAt(0).toUpperCase() + this.props.user.role.slice(1)}
                                    />
                                </Hidden>
                            </div>
                        </Grid>
                    </Grid>
                    <Grid item xs={6} align="right">
                        {this.props.isAdmin && this.renderEditandAwayButton()}
                    </Grid>
                </Grid>
                {profileDetails}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    "isAdmin": state.auth.isAdmin,
});

export default connect(mapStateToProps)(ProfileHeading);
