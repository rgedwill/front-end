import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import * as userActions from "../../../actions/userActions";
import * as apiActions from "../../../actions/apiActions";
import {GET} from "../../../actions/actionTypes";
import React, {Component} from "react";
import {Redirect} from "react-router-dom";

import {stringToColor} from "./accountUtils";
import Grid from "@material-ui/core/Grid";
import {Paper, Typography} from "@material-ui/core";
import "./Accounts.scss";

import BackButton from "../../BackButton";
import ComponentViewer from "./ComponentViewer.js";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import ProfileHeading from "./ProfileHeading.js";
import Avatar from "@material-ui/core/Avatar";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import BioIcon from "@material-ui/icons/PersonOutlined";
import CoursesIcon from "@material-ui/icons/SchoolOutlined";
import ScheduleIcon from "@material-ui/icons/CalendarTodayOutlined";
import NoteIcon from "@material-ui/icons/NoteOutlined";
import CurrentSessionsIcon from "@material-ui/icons/AssignmentOutlined";
import PastSessionsIcon from "@material-ui/icons/AssignmentTurnedInOutlined";
import PaymentIcon from "@material-ui/icons/CreditCardOutlined";
import ContactIcon from "@material-ui/icons/ContactPhoneOutlined";
import Hidden from "@material-ui/core/es/Hidden/Hidden";
import Loading from "../../Loading";
import Badge from "@material-ui/core/Badge";

const userTabs = {
    "instructor": [
        {
            "tab_heading": "Schedule",
            "tab_id": 0,
            "icon": <ScheduleIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Courses",
            "tab_id": 1,
            "icon": <CoursesIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Bio",
            "tab_id": 2,
            "icon": <BioIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Notes",
            "tab_id": 7,
            "icon": <notificationIcon className="TabIcon" />,
        },
    ],
    "student": [
        {
            "tab_heading": "Current Course(s)",
            "tab_id": 3,
            "icon": <CurrentSessionsIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Past Course(s)",
            "tab_id": 4,
            "icon": <PastSessionsIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Parent Contact",
            "tab_id": 6,
            "icon": <ContactIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Notes",
            "tab_id": 7,
            "icon": <NoteIcon className="TabIcon" />,
        },
    ],

    "parent": [
        {
            "tab_heading": "Student Info",
            "tab_id": 8,
            "icon": <CurrentSessionsIcon className="TabIcon" />,
        },
        // {
        //     "tab_heading": "Pay Courses",
        //     "tab_id": 9,
        //     "icon": <CurrentSessionsIcon className="TabIcon" />,
        // },
        {
            "tab_heading": "Payment History",
            "tab_id": 5,
            "icon": <PaymentIcon className="TabIcon" />,
        },
        {
            "tab_heading": "Notes",
            "tab_id": 7,
            "icon": <NoteIcon className="TabIcon" />,
        },

    ],
};

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "user": {},
            "value": 0,
            "alert": false,
        };
        this.currID = props.computedMatch.params.accountID;
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.fetchUserData();
    }

    componentDidUpdate(prevProps) {
        const { accountType, accountID } = this.props.computedMatch.params;
        if (prevProps.computedMatch.params.accountType !== accountType ||
            prevProps.computedMatch.params.accountID !== accountID) {
            this.fetchUserData();
        }
    }

    fetchUserData() {
        const { accountType, accountID } = this.props.computedMatch.params;
        this.props.userActions.fetchAccountNotes(accountID, accountType);
        switch (accountType) {
            case "student":
                this.props.userActions.fetchStudents(accountID);
                break;
            case "parent":
                this.props.userActions.fetchParents(accountID);
                break;
            case "instructor":
                this.props.userActions.fetchInstructors(accountID);
                break;
            case "receptionist":
                // future request for receptionists
                break;
            // no default
        }
    }

    componentDidUpdate(prevProps) {
        const {
            "accountType": currAccType,
            "accountID": currAccID
        } = this.props.computedMatch.params;

        const {
            "accountType": prevAccType,
            "accountID": prevAccID
        } = prevProps.computedMatch.params;

        // if looking at new profile, reset tab to the first one
        if (currAccType !== prevAccType || currAccID !== prevAccID) {
            const { accountType, accountID } = this.props.computedMatch.params;
            this.props.userActions.fetchAccountNotes(accountID, accountType);
            let user;
            switch (accountType) {
                case "student":
                    this.props.userActions.fetchStudents(accountID);
                    break;
                case "parent":
                    this.props.userActions.fetchParents(accountID);
                    break;
                case "instructor":
                    this.props.userActions.fetchInstructors(accountID);
                    break;
                case "receptionist":
                    // future request for receptionists
                    break;
                // no default
            }
            return user;
            this.setState({
                "value": 0,
            });
        }
    }

    getUser = () => {
        let user;
        const { accountType, accountID } = this.props.computedMatch.params;
        switch (accountType) {
            case "student":
                user = this.props.students[accountID];
                break;
            case "parent":
                user = this.props.parents[accountID];
                break;
            case "instructor":
                user = this.props.instructors[accountID];
                break;
            case "receptionist":
                user = this.props.receptionist[accountID];
                break;
            default:
                user = null;
        }
        return user;
    };

    getRequestStatus = () => {
        const { accountType, accountID } = this.props.computedMatch.params;
        return accountType === "receptionist"
            ? 200
            : this.props.requestStatus[accountType][GET][accountID];
    };

    handleChange(e, newTabIndex) {
        e.preventDefault();
        this.setState({ "value": newTabIndex });
    }

    hasImportantNotes() {
        return this.getUser() && this.getUser().notes &&
            Object.values(this.getUser().notes)
                .some(({ important }) => important);
    }

    renderNoteIcon() {
        if (this.getUser() && this.getUser().role != "receptionist") {
            if (this.hasImportantNotes()) {
                const numImportantNotes = Object.values(this.getUser().notes)
                    .reduce((total, {important}) => important ? total + 1: total, 0);

                userTabs[this.getUser().role].find(tab => tab.tab_id === 7).icon =
                    <Badge
                        color="primary"
                        badgeContent={numImportantNotes}
                    >
                        <NoteIcon className="TabIcon" />
                    </Badge>

            }
            else {
                userTabs[this.getUser().role].filter(tab => tab.tab_id === 7)[0].icon =
                    <NoteIcon className="TabIcon" />
            }
        }
    }

    render() {
        // this.renderNoteIcon();
        const status = this.getRequestStatus();
        if (!status || status === apiActions.REQUEST_STARTED) {
            return <Loading />
        }

        const user = this.getUser();

        if ((!user || user === -1) && (status < 200 || status >= 300)) {
            return <Redirect to="/PageNotFound" />;
        }

        this.renderNoteIcon();
        const { accountType } = this.props.computedMatch.params;
        const { activeTab } = this.state;
        const styles = {
            "backgroundColor": stringToColor(user.name),
            "color": "white",
            "width": "9vw",
            "height": "9vw",
            "fontSize": "3.5vw",
            "margin": 20,
        };
        let tabs;
        if (user.role !== "receptionist") {
            tabs =
                (
                    <div>
                        <Tabs
                            indicatorColor="primary"
                            key={this.props.inView}
                            onChange={this.handleChange}
                            textColor="primary"
                            value={this.state.value}>
                            {userTabs[accountType].map((tab) => (
                                <Tab
                                    key={tab.tab_id}
                                    label={<>{tab.icon} {tab.tab_heading}</>} />
                            ))}
                        </Tabs>
                        <ComponentViewer
                            inView={userTabs[accountType][this.state.value].tab_id}
                            user={user} />
                    </div>
                );
        } else {
            tabs = (
                <div>
                    <Grid align="left">
                        Action Log
                    </Grid>

                    <Paper className="paper">
                        <Table className="ActionTable">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Time</TableCell>
                                    <TableCell>Description</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Object.keys(user.action_log).map((rowID) => {
                                    const row = user.action_log[rowID];
                                    return (
                                        <TableRow
                                            className="row"
                                            key={row.date}>
                                            <TableCell
                                                component="th"
                                                scope="row">
                                                <Grid
                                                    alignItems="center"
                                                    container
                                                    layout="row">
                                                    <Grid
                                                        item
                                                        md={3} />
                                                    <Grid
                                                        item
                                                        md={9}>
                                                        <Typography>
                                                            {row.date}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell>{row.time}</TableCell>
                                            <TableCell>{row.description}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Paper>
                </div>
            );
        }
        return (
            <div className="UserProfile">
                <Paper className="paper">
                    <BackButton
                        warn={false} />
                    <hr />
                    <Grid className="padding" container layout="row" >
                        <Grid item md={2}>
                            <Hidden smDown>
                                <Avatar style={styles}>
                                    {user.name.toUpperCase().match(/\b(\w)/g).join("")}
                                </Avatar>
                            </Hidden>
                        </Grid>
                        <Grid item md={10} xs={12} className="headingPadding" >
                            <ProfileHeading user={user} />
                        </Grid>
                    </Grid>
                    {tabs}
                </Paper>
            </div>
        );
    }

}

UserProfile.propTypes = {};

const mapStateToProps = (state) => ({
    "students": state.Users.StudentList,
    "parents": state.Users.ParentList,
    "instructors": state.Users.InstructorList,
    "receptionist": state.Users.ReceptionistList,
    "requestStatus": state.RequestStatus,
});

const mapDispatchToProps = (dispatch) => ({
    "userActions": bindActionCreators(userActions, dispatch),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserProfile);
