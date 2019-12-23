import * as hooks from "actions/hooks";
import {Link, useLocation} from "react-router-dom";
import React, {useCallback, useMemo} from "react";
import {courseDataParser} from "utils";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import Grid from "@material-ui/core/Grid";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const today = new Date();

const paymentStatus = (numPaidCourses) => {
    if (numPaidCourses > 3) {
        return "good";
    } else if (numPaidCourses <= 3 && numPaidCourses > 0) {
        return "warning";
    } else if (numPaidCourses <= 0) {
        return "bad";
    }
};

const StudentCourseViewer = ({studentID, current = true}) => {
    const courses = useSelector(({Course}) => Course.NewCourseList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);
    const {pathname} = useLocation();

    const enrollmentStatus = hooks.useEnrollmentByStudent(studentID);
    const courseList = useMemo(() =>
        enrollments[studentID] ? Object.keys(enrollments[studentID]) : []
    , [enrollments, studentID]);
    const courseStatus = hooks.useCourse(courseList);

    const numPaidCourses = useCallback((courseID) => {
        if (!enrollments[studentID][courseID]) {
            return 0;
        }

        return Object.values(
            enrollments[studentID][courseID].session_payment_status
        ).reduce(
            (numPaid, status) =>
                status === 1 ? numPaid + 1 : numPaid, 0
        );
    }, [enrollments, studentID]);

    const filterCourseByDate = useCallback((endDate) => {
        const inputEndDate = new Date(endDate);
        // see if course is current or not
        // and match it appropriately with the passed filter
        return current === (inputEndDate >= today);
    }, [current]);

    const displayedCourses = useMemo(() =>
        courseList.filter((courseID) => courses[courseID] &&
            filterCourseByDate(courses[courseID].schedule.end_date)),
    [courseList, courses, filterCourseByDate]);

    if (!enrollments[studentID]) {
        if (hooks.isLoading(enrollmentStatus, courseStatus)) {
            return <Loading />;
        }

        if (hooks.isFail(enrollmentStatus, courseStatus)) {
            return "Error loading courses!";
        }
    }

    return (
        <Grid container>
            <Grid
                item
                xs={12}>
                <Grid
                    className="accounts-table-heading"
                    container>
                    <Grid
                        item
                        xs={3}>
                        <Typography
                            align="left"
                            className="table-header">
                            Session
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={3}>
                        <Typography
                            align="left"
                            className="table-header">
                            Dates
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={2}>
                        <Typography
                            align="left"
                            className="table-header">
                            Class Day(s)
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={3}>
                        <Typography
                            align="left"
                            className="table-header">
                            Time
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={1}>
                        <Typography
                            align="left"
                            className="table-header">
                            Status
                        </Typography>
                    </Grid>
                </Grid>
                <Grid
                    container
                    spacing={8}>
                    {displayedCourses.length !== 0
                        ? displayedCourses.map((courseID) => {
                            const course = courses[courseID];
                            if (!course) {
                                return "Loading...";
                            }
                            const {days, startDate, endDate, startTime, endTime} = courseDataParser(course);
                            return (
                                <Grid
                                    className="accounts-table-row"
                                    component={Link}
                                    item
                                    key={courseID}
                                    md={12}
                                    to={`${pathname}/${courseID}`}
                                    xs={12}>
                                    <Paper square>
                                        <Grid container>
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {course.title}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {startDate} - {endDate}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={2}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {days}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={3}>
                                                <Typography
                                                    align="left"
                                                    className="accounts-table-text">
                                                    {startTime} - {endTime}
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={1}>
                                                <div className={`sessions-left-chip ${paymentStatus(numPaidCourses(courseID))}`}>
                                                    {numPaidCourses(courseID)}
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>
                            );
                        })
                        : <Grid
                            item
                            xs={12}>
                            <Paper className="info">
                                <Typography style={{"fontWeight": 700}}>
                                    No Courses Yet!
                                </Typography>
                            </Paper>
                          </Grid>
                    }
                </Grid>
            </Grid>
        </Grid>
    );
};

StudentCourseViewer.propTypes = {
    "current": PropTypes.bool,
    "studentID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default StudentCourseViewer;