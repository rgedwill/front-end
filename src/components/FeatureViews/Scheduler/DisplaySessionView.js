import React, {useEffect, useMemo, useState} from "react";
// Material UI Imports
import Grid from "@material-ui/core/Grid";

import {bindActionCreators} from "redux";
import * as registrationActions from "../../../actions/registrationActions";
import * as userActions from "../../../actions/userActions.js"
import {useDispatch, useSelector} from "react-redux";
import {Tooltip, Typography, withStyles} from "@material-ui/core";
import {NavLink, useParams} from "react-router-dom";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as apiActions from "../../../actions/apiActions";
import Button from "@material-ui/core/Button";
import Loading from "../../Loading";
import Avatar from "@material-ui/core/Avatar";
import {stringToColor} from "../Accounts/accountUtils";
import DialogTitle from "@material-ui/core/DialogTitle";
import Divider from "@material-ui/core/Divider";
import DialogContent from "@material-ui/core/DialogContent";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {dayOfWeek} from "../../Form/FormUtils";
import * as hooks from "actions/hooks";
import ConfirmIcon from "@material-ui/icons/CheckCircle";
import UnconfirmIcon from "@material-ui/icons/Cancel";
import {EDIT_ALL_SESSIONS, EDIT_CURRENT_SESSION} from "./SessionView";
import DialogContentText from "@material-ui/core/es/DialogContentText";

import InstructorSchedule from "../Accounts/TabComponents/InstructorSchedule";
import {SessionPaymentStatusChip} from "../../SessionPaymentStatusChip";
import AddSessions from "AddSessions";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import {capitalizeString} from "../../../utils";

const StyledMenu = withStyles({
    paper: {
        border: "1px solid #d3d4d5",
    },
})((props) => (
    <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "center",
        }}
        {...props}
    />
));

const styles = (username) => ({
    "backgroundColor": stringToColor(username),
    "color": "white",
    "width": "3vw",
    "height": "3vw",
    "fontSize": 15,
    "marginRight": 10,
});

const DisplaySessionView = ({course, session, handleToggleEditing}) => {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(apiActions, dispatch),
            ...bindActionCreators(userActions, dispatch),
            ...bindActionCreators(registrationActions, dispatch),
        }),
        [dispatch]
    );

    const { instructor_id } = useParams();

    const instructors = useSelector(({"Users": {InstructorList}}) => InstructorList);
    const categories = useSelector(({"Course": {CourseCategories}}) => CourseCategories);
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);

    const [enrolledStudents, setEnrolledStudents] = useState(false);
    const [edit, setEdit] = useState(false);
    const [unenroll, setUnenroll] = useState(false);
    const [editSelection, setEditSelection] = useState(EDIT_CURRENT_SESSION);
    const [tutoringActionsAnchor, setTutoringActionsAnchor] = useState(null);

    useEffect(() => {
        api.initializeRegistration();
    }, [api]);

    const enrollmentStatus = hooks.useEnrollmentByCourse(course.course_id);
    const enrollments = useSelector(({ Enrollments }) => Enrollments);
    const reduxCourse = courses[course.course_id];
    const studentStatus = reduxCourse.roster.length > 0 && hooks.useStudent(reduxCourse.roster);

    const loadedStudents = useMemo(() =>
        reduxCourse.roster.filter((studentID) => students[studentID])
    , [reduxCourse.roster, students]);

    useEffect(() => {
        if (studentStatus === 200) {
            setEnrolledStudents(loadedStudents.map((studentID) => ({
                ...students[studentID],
            })));
        }
    }, [loadedStudents, studentStatus, students]);

    if (loadedStudents.length === 0 && reduxCourse.roster.length > 1) {
        if (hooks.isLoading(studentStatus)) {
            return <Loading />;
        }
        if (hooks.isFail(studentStatus)) {
            return "Error loading enrollment details!";
        }
    }

    const instructor = instructors[instructor_id] || {"name": "N/A"};
    const studentKeys = Object.keys(enrolledStudents);

    const handleTutoringMenuClick = (event) => {
        setTutoringActionsAnchor(event.currentTarget);
    };
    const closeTutoringMenu = () => {
        setTutoringActionsAnchor(null);
    };

    const handleEditToggle = (cancel) => (event) => {
        event.preventDefault();
        if (!cancel && edit) {
            // if we're applying to edit session then toggle to edit view
            handleToggleEditing(editSelection);
        } else {
            setEdit(!edit);
        }
    };

    const handleEditSelection = (event) => {
        setEditSelection(event.target.value);
    };

    const handleUnenroll = event => {
        event.preventDefault();
        setTutoringActionsAnchor(null);
        setUnenroll(true);
    };

    // We only support unenrollment from session view for tutoring courses
    const closeUnenrollDialog = (toUnenroll) => event => {
        event.preventDefault();
        setUnenroll(false);
        if(toUnenroll){
            // We assume course is tutoring course thus we're getting the first studentID
            const enrollment = enrollments[course.roster[0]][course.course_id];
            api.deleteEnrollment(enrollment);
        }
    };

    if (!course || !categories || (Object.entries(enrollments).length === 0 && enrollments.constructor === Object)) {
        return <Loading />;
    }

    const sessionStart = new Date(session.start_datetime);
    const day = sessionStart.getDate() !== new Date().getDate()
        ? session.start - 1 >= 0 ? session.start - 1 : 6
        : session.start;

    return (
        <>
            <Grid
                className="session-view"
                container
                direction="row"
                spacing={8}>
                <Grid
                    item
                    sm={12}>
                    <Typography
                        align="left"
                        className="session-view-title"
                        variant="h3">
                        {session && session.title}
                    </Typography>
                </Grid>
                <Grid item sm={12}>
                    <Grid container>
                        <Grid item xs={2} className="course-session-status">
                            {
                                course.course_type == "tutoring"  &&
                                    <SessionPaymentStatusChip
                                        setPos
                                        enrollment={enrollments[Object.keys(enrollments)[0]][course.course_id]}
                                        session={session}
                                    />
                            }
                        </Grid>
                    </Grid>
                </Grid>
                <Grid
                    align="left"
                    className="session-view-details"
                    container
                    item
                    spacing={16}
                    xs={6}>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Subject</Typography>
                        <Typography >
                            {
                                (categories.find(
                                    (category) => category.id === course.category
                                ) || {}).name
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Room</Typography>
                        <Typography >
                            {
                                course && (course.room_id || "TBA")
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Typography variant="h5">
                        Instructor
                            {
                                session.is_confirmed
                                    ? <ConfirmIcon className="confirmed course-icon" />
                                    : <UnconfirmIcon className="unconfirmed course-icon" />
                            }
                        </Typography>
                        {
                            course &&
                            <NavLink
                                style={{"textDecoration": "none"}}
                                to={`/accounts/instructor/${instructor.user_id}`}>
                                <Tooltip
                                    aria-label="Instructor Name"
                                    title={instructor.name}>
                                    <Avatar
                                        style={styles(instructor.name)}>
                                        {instructor.name.match(/\b(\w)/g).join("")}
                                    </Avatar>
                                </Tooltip>
                            </NavLink>
                        }
                    </Grid>
                    <Grid
                        item
                        xs={12}>
                        <Typography
                            align="left"
                            variant="h5">
                        Students Enrolled
                        </Typography>
                        <Grid
                            container
                            direction="row">
                            {studentKeys.map((key) =>
                                (
                                    <NavLink
                                        key={key}
                                        style={{"textDecoration": "none"}}
                                        to={`/accounts/student/${enrolledStudents[key].user_id}/${course.course_id}`}>
                                        <Tooltip title={enrolledStudents[key].name}>
                                            <Avatar
                                                style={styles(enrolledStudents[key].name)}>
                                                {
                                                    enrolledStudents
                                                        ? enrolledStudents[key].name.match(/\b(\w)/g).join("")
                                                        : hooks.isFail(enrollmentStatus)
                                                            ? "Error!"
                                                            : "Loading..."
                                                }
                                            </Avatar>
                                        </Tooltip>
                                    </NavLink>
                                ))}
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Day(s)</Typography>
                        <Typography>{capitalizeString(dayOfWeek[day])}</Typography>
                        <Typography>
                            {
                                new Date(session.start_datetime).toLocaleDateString()
                            }
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={6}>
                        <Typography variant="h5">Time</Typography>
                        <Typography>{session.startTime} - {session.endTime}</Typography>
                    </Grid>
                </Grid>
                <Grid
                    item
                    xs={6}>
                    <InstructorSchedule instructorID={instructor_id} />
                </Grid>
            </Grid>
            <Grid
                className="session-detail-action-control"
                container
                direction="row"
                justify="flex-end">
                <Grid item>
                    {
                        studentKeys.length == 1 && <>
                            <Button
                                className="button"
                                onClick={handleTutoringMenuClick}
                            >
                                Tutoring Options
                            </Button>
                            <StyledMenu
                                anchorEl={tutoringActionsAnchor}
                                keepMounted
                                open={Boolean(tutoringActionsAnchor)}
                                onClose={closeTutoringMenu}
                            >
                                <MenuItem
                                    component={NavLink}
                                    to={`/accounts/student/${course.roster[0]}/${course.course_id}`}
                                    color="secondary"
                                    variant="outlined">
                                    Enrollment View
                                </MenuItem>
                                <AddSessions
                                    componentOption="menuItem"
                                    parentOfCurrentStudent={students[course.roster[0]].parent_id}
                                    enrollment={enrollments[course.roster[0]][course.course_id]}
                                />
                                <MenuItem
                                    onClick={handleUnenroll}
                                    color="secondary"
                                    variant="outlined">
                                    Unenroll Course
                                </MenuItem>
                            </StyledMenu>
                        </>
                    }
                </Grid>
            <Grid item>
                <Button
                    className="button"
                    color="secondary"
                    to="/"
                    onClick={handleEditToggle(true)}
                    variant="outlined">
                    Edit Session
                </Button>
            </Grid>
            <Grid item>
                <Button
                    className="button"
                    color="secondary"
                    component={NavLink}
                    to={`/registration/course/${course.course_id}`}
                    variant="outlined">
                    Course Page
                </Button>
            </Grid>
            <Grid item>
                <Button
                    className="button"
                    color="secondary"
                    component={NavLink}
                    to="/scheduler"
                    variant="outlined">
                    Return to scheduling
                </Button>
            </Grid>
        </Grid>
        <Dialog
            aria-describedby="form-dialog-description"
            aria-labelledby="form-dialog-title"
            className="session-view-modal"
            fullWidth
            maxWidth="xs"
            onClose={handleEditToggle(true)}
            open={edit}>
            <DialogTitle id="form-dialog-title">Edit Session</DialogTitle>
            <Divider />
            <DialogContent>
                <RadioGroup
                    aria-label="delete"
                    name="delete"
                    value={editSelection}
                    onChange={handleEditSelection}>
                    <FormControlLabel
                        control={<Radio color="primary" />}
                        label="This Session"
                        labelPlacement="end"
                        value={EDIT_CURRENT_SESSION} />
                    <FormControlLabel
                        control={<Radio color="primary" />}
                        label="All Sessions"
                        labelPlacement="end"
                        value={EDIT_ALL_SESSIONS} />
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={handleEditToggle(true)}>
                    Cancel
                </Button>
                <Button
                    color="primary"
                    onClick={handleEditToggle(false)}>
                    Confirm to Edit
                </Button>
            </DialogActions>
        </Dialog>

        <Dialog
            aria-describedby="unenroll-dialog-description"
            aria-labelledby="unenroll-dialog-title"
            className="session-view-modal"
            fullWidth
            maxWidth="xs"
            onClose={closeUnenrollDialog(false)}
            open={unenroll}>
            <DialogTitle id="unenroll-dialog-title">Unenroll in {course.title}</DialogTitle>
            <Divider />
            <DialogContent>
                <DialogContentText>
                    You are about to unenroll in <b>{course.title}</b> for <b>{ enrolledStudents && enrolledStudents[studentKeys[0]].name}</b>.
                    Performing this action will credit the remaining enrollment balance back to the parent's account balance.
                    Are you sure you want to unenroll?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={closeUnenrollDialog(true)}>
                    Yes, unenroll
                </Button>
                <Button
                    color="primary"
                    onClick={closeUnenrollDialog(false)}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default DisplaySessionView;
