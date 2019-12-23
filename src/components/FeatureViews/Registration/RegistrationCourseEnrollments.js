import * as hooks from "actions/hooks";
import React, {Fragment, useCallback, useEffect, useMemo, useState} from "react";
import {addDashes} from "components/FeatureViews/Accounts/accountUtils";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {useSelector} from "react-redux";

import DownArrow from "@material-ui/icons/KeyboardArrowDown";
import EditIcon from "@material-ui/icons/Edit";
import EmailIcon from "@material-ui/icons/Email";
import LinearProgress from "@material-ui/core/LinearProgress";
import Loading from "components/Loading";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import UpArrow from "@material-ui/icons/KeyboardArrowUp";

import "theme/theme.scss";
import "./registration.scss";


const TableToolbar = (
    <TableHead>
        <TableRow>
            {["Student", "Parent", "Phone", "Status", ""].map((heading) => (
                <TableCell
                    align="left"
                    key={heading}
                    padding="default">
                    {heading}
                </TableCell>
            ))}
        </TableRow>
    </TableHead>
);

const RegistrationCourseEnrollments = ({courseID}) => {
    const [expanded, setExpanded] = useState({});
    const courses = useSelector(({"Course": {NewCourseList}}) => NewCourseList);
    const parents = useSelector(({"Users": {ParentList}}) => ParentList);
    const students = useSelector(({"Users": {StudentList}}) => StudentList);
    const enrollments = useSelector(({Enrollments}) => Enrollments);

    const toggleExpanded = useCallback((studentID) => () => {
        setExpanded((prevExpanded) => ({
            ...prevExpanded,
            [studentID]: !prevExpanded[studentID],
        }));
    }, []);

    const enrollmentStatus = hooks.useEnrollmentByCourse(courseID);
    const course = courses[courseID];
    const studentStatus = hooks.useStudent(course.roster);

    const parentList = useMemo(() => course.roster
        .filter((studentID) => students[studentID])
        .map((studentID) => students[studentID].parent_id)
    , [course.roster, students]);
    const parentStatus = hooks.useParent(parentList);

    useEffect(() => {
        setExpanded((prevExpanded) =>
            course.roster.reduce((object, studentID) => ({
                ...object,
                [studentID]: prevExpanded[studentID] || false,
            }), {}));
    }, [course.roster]);

    const loadedStudents = useMemo(() =>
        course.roster.filter((studentID) => students[studentID])
    , [course.roster, students]);

    if (loadedStudents.length === 0) {
        if (hooks.isLoading(studentStatus)) {
            return <Loading />;
        }
        if (hooks.isFail(studentStatus)) {
            return "Error loading enrollment details!";
        }
    }

    return (
        <div>
            <div className="course-status">
                <div className="status">
                    <div className="text">
                        {course.roster.length} / {course.capacity} Spaces Taken
                    </div>
                </div>
                <LinearProgress
                    color="primary"
                    value={course.roster.length / course.capacity * 100}
                    valueBuffer={100}
                    variant="buffer" />
            </div>
            <Table>
                {TableToolbar}
                <TableBody>
                    {
                        loadedStudents.map((studentID) => {
                            const student = students[studentID];
                            const parent = parents[student.parent_id];
                            const enrollment =
                                enrollments[studentID] && enrollments[studentID][courseID];
                            const paymentStatus = enrollment &&
                                Object.values(enrollment.session_payment_status)
                                    .every((status) => status !== 0);
                            const notes = (enrollment && enrollment.notes) || {};
                            return (
                                <Fragment key={studentID}>
                                    <TableRow>
                                        <TableCell className="bold">
                                            <Link
                                                className="no-underline"
                                                to={`/accounts/student/${studentID}`}>
                                                {student.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            {
                                                parent ?
                                                    <Link
                                                        className="no-underline"
                                                        to={`/accounts/parent/${student.parent_id}`}>
                                                        {parent.name}
                                                    </Link>
                                                    : hooks.isLoading(parentStatus) ?
                                                        "Loading..." : "Error"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                parent ?
                                                    addDashes(parent.phone_number)
                                                    : hooks.isLoading(parentStatus) ?
                                                        "Loading..." : "Error"
                                            }
                                        </TableCell>
                                        <TableCell>
                                            {
                                                enrollment
                                                    ? <div
                                                        key={studentID}
                                                        style={{
                                                            "padding": "5px 0",
                                                            "borderRadius": "10px",
                                                            "backgroundColor": paymentStatus ? "#28D52A" : "#E9515B",
                                                            "textAlign": "center",
                                                            "width": "7vw",
                                                            "color": "white",
                                                        }}>
                                                        {paymentStatus ? "Paid" : "Unpaid"}
                                                      </div>
                                                    : hooks.isFail(enrollmentStatus)
                                                        ? "Error!"
                                                        : "Loading..."
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                className="actions"
                                                key={studentID}>
                                                {
                                                    parent &&
                                                        <a href={`mailto:${parent.email}`}>
                                                            <EmailIcon />
                                                        </a>
                                                }
                                                <span><EditIcon /></span>
                                                <span>
                                                    {expanded[studentID]
                                                        ? <UpArrow onClick={toggleExpanded(studentID)} />
                                                        : <DownArrow onClick={toggleExpanded(studentID)} />
                                                    }
                                                </span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                    {
                                        expanded[studentID] &&
                                            <TableRow align="left">
                                                <TableCell colSpan={5}>
                                                    <Paper
                                                        elevation={0}
                                                        square>
                                                        <Typography
                                                            style={{
                                                                "padding": "10px",
                                                            }}>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>School</b>: {
                                                                    student.school
                                                                }
                                                                <br />
                                                            </span>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>School Teacher</b>: {
                                                                    notes["Current Instructor in School"]
                                                                }
                                                                <br />
                                                            </span>
                                                            <span style={{"padding": "5px"}}>
                                                                <b>Textbook:</b> {
                                                                    notes["Textbook Used"]
                                                                }
                                                                <br />
                                                            </span>
                                                        </Typography>
                                                    </Paper>
                                                </TableCell>
                                            </TableRow>
                                    }
                                </Fragment>
                            );
                        })
                    }
                </TableBody>
            </Table>
        </div>
    );
};

RegistrationCourseEnrollments.propTypes = {
    "courseID": PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
    ]).isRequired,
};

export default RegistrationCourseEnrollments;