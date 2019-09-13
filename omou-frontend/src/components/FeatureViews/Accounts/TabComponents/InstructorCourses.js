import { connect } from 'react-redux';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import Hidden from "@material-ui/core/Hidden";

class InstructorCourses extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseIDs: [],
        };
    }

    componentWillMount() {
        this.setState(()=>{
            let CoursesTaughtByInstructor = Object.keys(this.props.courseList).filter((courseID)=>{
               let courseInstructorID = this.props.courseList[courseID].instructor_id;
               return this.props.user_id === courseInstructorID;
            });
            return {
                courseIDs: CoursesTaughtByInstructor,
            }
        })
    }

    render() {
        return(<Grid container>
            <Grid item md={12}>
                <Hidden xsDown>
                    <Grid container className={'accounts-table-heading'}>
                        <Grid item md={1}>
                        </Grid>
                        <Grid item md={3}>
                            <Typography align={'left'} style={{color:'white', fontWeight:'500'}}>
                                Session
                            </Typography>
                        </Grid>
                        <Grid item md={3}>
                            <Typography align={'left'} style={{color:'white', fontWeight:'500'}}>
                                Dates
                            </Typography>
                        </Grid>
                        <Grid item md={2}>
                            <Typography align={'left'} style={{color:'white', fontWeight:'500'}}>
                                Class Day(s)
                            </Typography>
                        </Grid>
                        <Grid item md={3}>
                            <Typography align={'left'} style={{color:'white', fontWeight:'500'}}>
                                Time
                            </Typography>
                        </Grid>
                    </Grid>
                </Hidden>
            </Grid>
            <Grid container spacing={8}>
            {
                this.state.courseIDs.map((courseID)=>{
                    let course = this.props.courseList[courseID];
                    let DayConverter = {
                        1: "Monday",
                        2: "Tuesday",
                        3: "Wednesday",
                        4: "Thursday",
                        5: "Friday",
                        6: "Saturday",
                    };
                    let Days = course.schedule.days.map((day) => {
                        return DayConverter[day];
                    });

                    let timeOptions = { hour: "2-digit", minute: "2-digit" };
                    let dateOptions = { year: "numeric", month: "short", day: "numeric"};
                    let startDate = new Date(course.schedule.start_date + course.schedule.start_time),
                        endDate = new Date(course.schedule.end_date + course.schedule.end_time),
                        startTime = startDate.toLocaleTimeString("en-US",timeOptions),
                        endTime = endDate.toLocaleTimeString("en-US",timeOptions);
                    startDate = startDate.toLocaleDateString("en-US",dateOptions);
                    endDate = endDate.toLocaleDateString("en-US", dateOptions);
                    return (<Grid item md={12} className={'accounts-table-row'}>
                        <Paper square={true} >
                            <Grid container>
                                <Grid item md={1}>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Typography align={'left'} style={{fontWeight:'700'}}>
                                        {course.title}
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Typography align={'left'}>
                                        {startDate} - {endDate}
                                    </Typography>
                                </Grid>
                                <Grid item md={2} xs={12}>
                                    <Typography align={'left'}>
                                        {Days}
                                    </Typography>
                                </Grid>
                                <Grid item md={3} xs={12}>
                                    <Typography align={'left'}>
                                        {startTime} - {endTime}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>);
                })
            }
            </Grid>
        </Grid>)
    }

}

InstructorCourses.propTypes = {};

function mapStateToProps(state) {
    return {
        courseList: state.Course.NewCourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(InstructorCourses);