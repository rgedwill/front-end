import PropTypes from "prop-types";
import React from "react";

import Bio from "./TabComponents/Bio";
import CourseViewer from "./TabComponents/CourseViewer";
import Grid from "@material-ui/core/Grid";
import InstructorCourses from "./TabComponents/InstructorCourses";
import Notes from "../Notes/Notes";
import ParentContact from "./TabComponents/ParentContact";
import PayCourses from "./TabComponents/PayCourses";
import PaymentHistory from "./TabComponents/PaymentHistory";
import Schedule from "./TabComponents/Schedule.js";
import StudentInfo from "./TabComponents/StudentInfo";

const ComponentViewer = (props) => {
    let component;

    switch (props.inView) {
        case 0:
            component = (
                <Schedule
                    user_id={props.user.user_id}
                    work_hours={props.user.schedule.work_hours} />
            );
            break;
        case 1:
            component = (
                <InstructorCourses user_id={props.user.user_id} />
            );
            break;
        case 2:
            component = (
                <Bio background={props.user.background} />
            );
            break;
        case 3:
            component = (
                <CourseViewer
                    current
                    key={props.inView}
                    user_id={props.user.user_id}
                    user_role={props.user.role} />
            );
            break;
        case 4:
            component = (
                <CourseViewer
                    current={false}
                    user_id={props.user.user_id}
                    user_role={props.user.role} />
            );
            break;
        case 5:
            component = (
                <PaymentHistory
                    user_id={props.user.user_id} />
            );
            break;
        case 6:
            component = (
                <ParentContact
                    parent_id={props.user.parent_id} />
            );
            break;
        case 7:
            component = (
                <Notes
                    ownerID={props.user.user_id}
                    ownerType={props.user.role} />
            );
            break;
        case 8:
            component = (
                <StudentInfo user={props.user} />
            );
            break;
        case 9:
            component = (
                <PayCourses user={props.user} />
            );
            break;
        default:
            component = <Schedule />;
    }

    return (
        <Grid container>
            <Grid
                item
                style={{"paddingTop": "15px"}}
                xs={12}>
                {component}
            </Grid>
        </Grid>
    );
};

ComponentViewer.propTypes = {
    "inView": PropTypes.number.isRequired,
    "user": PropTypes.shape({
        "background": PropTypes.object,
        "parent_id": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        "role": PropTypes.oneOf([
            "instructor",
            "parent",
            "receptionist",
            "student",
        ]).isRequired,
        "schedule": PropTypes.shape({
            "work_hours": PropTypes.object,
        }),
        "user_id": PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
    }).isRequired,
};

export default ComponentViewer;
