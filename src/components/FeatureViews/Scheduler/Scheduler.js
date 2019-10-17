import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import PropTypes, {bool} from "prop-types";
import React, {Component} from "react";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listViewPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";

import * as calenderActions from "../../../actions/calenderActions";

// material-Ui dependencies

import Button from "@material-ui/core/Button";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftOutlinedIcon from "@material-ui/icons/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import Paper from "@material-ui/core/Paper";
import DateRangeOutlinedIcon from "@material-ui/icons/DateRangeOutlined";
import ViewListIcon from "@material-ui/icons/ViewList";
import SearchIcon from "@material-ui/icons/Search";

// tool tip dependencies
import tippy from "tippy.js";
import "tippy.js/themes/google.css";
import "./scheduler.scss";
import {GET} from "../../../actions/actionTypes";


class Scheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "calendarWeekends": true,
            "calendarResources": [],
            "calendarEvents": [],
            "currentDate": "",
            "viewValue": "",
            "filterValue": "C",
            "resourceFilterValue": "R",
            "calendarIcon": true,
            "resourceIcon": false,

        };
    }

    calendarComponentRef = React.createRef();

    componentWillMount() {
        this.setState({
            "calendarEvents": this.getEvents(),
        });
    }

    componentDidMount() {
        this.setState({
            "currentDate": this.currentDate(),
        });
    }

    // the eventRender function handles the tooltip
    handleToolTip(info) {
        function truncate(string) {
            const numberOfCharRemoved = 88;
            if (string.length > numberOfCharRemoved) {return string.substring(0, numberOfCharRemoved) + '...';}
            else {return string;}
        }



        new tippy(info.el, {
            "content": `
            <div class="toolTip">
            <div class='title'><h3> ${info.event.title} </h3></div>
            <div class="container">
            <div class='clock'><span class='clock_icon'>  ${new Date(info.event.start).toDateString()
                    .slice(0, 10)}</span></div>
            <span>
            ${info.event.extendedProps.type}
            </span>
            <div class='pin_icon'><span class=''>Room # ${info.event.extendedProps.room_id}</span></div>
            <div class='teacher_icon'><span class=''>${info.event.extendedProps.instructor ? info.event.extendedProps.instructor : "No teacher Yet"}</span></div>
            <div class='discription_icon'><span class='description-text'>${truncate(info.event.extendedProps.description)}</span></div>
            </div>
        </div>
            `,
            "theme": "light",
            "placement": "right",
            "interactive": true,
        });
    }


    // full Calendar API used to change calendar views
    toggleWeekends = () => {
        this.setState({ // update a property
            "calendarWeekends": !this.state.calendarWeekends,
        });
    };

    // change from day,week, and month views
    changeView = (value) => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView(value);
        const date = this.currentDate();
        this.setState({
            "viewValue": value,
            "currentDate": date,
        });
    }

    goToNext = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();

        calendarApi.next();
        const date = this.currentDate();
        this.setState({
            "currentDate": date,
        });
    }

    goToPrev = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.prev();
        const date = this.currentDate();
        this.setState({
            "currentDate": date,
        });
    }

    today = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.today();
        this.currentDate();
    }

    currentDate = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        const date = calendarApi.view.title;
        return date;
    }

    // this function changes the resouce view when click as well as change the color of the icon
    changeViewToResource = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView("resourceTimeline");
        this.currentDate();
        this.setState({
            "resourceIcon": true,
            "calendarIcon": false,
            "calendarResources": this.getRoomResources(),
        });
    }

    changeViewToCalendar = () => {
        const calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.changeView("dayGridMonth");
        this.currentDate();
        this.setState({
            "calendarIcon": true,
            "resourceIcon": false,
        });
    }

    // function to parse the inital state into data that full calendar could
    getEvents = () => {
        const courseKeys = Object.keys(this.props.sessions);
        const instructorKeys = Object.keys(this.props.instructors);


        // creates an array from courseKeys [0,1,2,3,...,10]
        const sessionsInViewList = courseKeys.map((courseKey) => {
            // course will get each session and map with courseKey
            const course = this.props.sessions[courseKey];
            // gets the keys to each session that was mapped
            const courseSessionKeys = Object.keys(course);
            // creates an array that maps through courseSessionKey
            const courseSessions = courseSessionKeys.map((sessionKey) => {
                /*
                 * sessions = sessions from initial state
                 * courseKey is the key value from inital state
                 * sessionKey is the variable named inside the map, this is mapping over each coursekey
                 * session is the matched pairs of course and session objects
                 */
                const session = this.props.sessions[courseKey][sessionKey];

                session.title = this.props.courses[session.course_id].title;
                session.description = this.props.courses[session.course_id].description;
                session.type = this.props.courses[session.course_id].type;
                session.resourceId = this.props.courses[session.course_id].room_id;

                return session;
            });
            return courseSessions;
        });

        let sessionsInView = [];
        sessionsInViewList.forEach((sessionsList) => {
            sessionsInView = sessionsInView.concat(sessionsList);
        });

        const sessionsInViewWithUrl = sessionsInView.map((el) => {
            const newSessions = {...el};
            newSessions.url = `http:/scheduler/view-session/${newSessions.course_id}/${newSessions.session_id}`;
            return newSessions;
        });

        return sessionsInViewWithUrl;
    }

    // this function is used in material-ui for the eventhandler
    handleFilterChange = (name) => (event) => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
        this.filterEvent(event.target.value);
    }

    // this will filter out event based on type
    filterEvent = (filterType) => {
        // grabs the array of objects to filter
        const items = this.getEvents();
        const newEvents = items.filter(({type}) => type !== filterType);
        this.setState((prevState) => (
            {
                "calendarEvents": prevState.calendarEvents = newEvents,
            }));
    }

    handleResourceFilterChange = (name) => (event) => {
        this.setState({
            ...this.state,
            [name]: event.target.value,
        });
        if (event.target.value === "R") {
            this.setState({
                "calendarResources": this.getRoomResources(),
            });
        } else {
            const instructors = this.getInstructorResources();
            this.setState({
                "calendarResources": instructors,
            });
        }
        this.setState((prevState) => prevState.counter + 1);
    }


    // gets the values of course object
    getRoomResources = () => {
        const courses = Object.values(this.props.courses);
        const resourceList = courses.map((course) => ({
            "id": course.course_id,
            "title": `Room ${course.room_id}`,

        }));

        return resourceList;
    }

    // gets values of instructors and places them in the resource col
    getInstructorResources = () => {
        const instructor = Object.values(this.props.instructors);
        const instructorList = instructor.map((inst) => {
            return {
                "id": inst.user_id,
                "title": inst.name,
            };
        });

        return instructorList;
    }


    render() {
        return (
            <Grid >
                <Paper className="paper">
                    <div className="demo-app-calendar">
                        <Typography align="left" variant="h3">Scheduler</Typography>
                        <br />
                        <Grid
                            alignItems="center"
                            className="scheduler-header"
                            container
                            direction="row">
                            <Grid item >
                                <IconButton color={this.state.calendarIcon ? "primary" : ""}
                                    onClick={this.changeViewToCalendar}
                                    className={'calendar-icon'}
                                    aria-label='next-month'>
                                    <DateRangeOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <IconButton aria-label='next-month' className={'resource-icon'} color={this.state.resourceIcon ? "primary" : ""} onClick={this.changeViewToResource}>
                                    <ViewListIcon />
                                </IconButton>
                            </Grid>
                            <Grid item >
                                <IconButton onClick={this.goToNext}
                                    className={'next-month'}
                                    aria-label='next-month'>
                                    <SearchIcon />
                                </IconButton>
                            </Grid>
                            <Grid item lg={1} md={1}>
                                {this.state.calendarIcon
                                    ? <FormControl className="filter-select">
                                        <InputLabel htmlFor="filter-class-type" />

                                        <Select
                                            inputProps={{
                                                name: 'filterValue',
                                                id: 'filter-class-type',
                                            }}
                                            native
                                            onChange={this.handleFilterChange('filterValue')}
                                            value={this.state.filterValue}>
                                            <option value="C">Class</option>
                                            <option value="T">Tutor</option>
                                        </Select>
                                    </FormControl>
                                    : <FormControl className="filter-select">
                                        <InputLabel htmlFor="filter-resource-type" />

                                        <Select
                                            inputProps={{
                                                name: 'resourceFilterValue',
                                                id: 'filter-resource-type',
                                            }}
                                            native
                                            onChange={this.handleResourceFilterChange('resourceFilterValue')}
                                            value={this.state.resourceFilterValue}>
                                            <option value="R">Room</option>
                                            <option value="I">Instructors</option>
                                        </Select>
                                    </FormControl>
                                }

                            </Grid>
                            <Grid item
                                lg={1}
                                md={1}>
                                <IconButton aria-label="prev-month" className={'prev-month'} onClick={this.goToPrev}>
                                    <ChevronLeftOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item
                                lg={3}
                                md={2}>
                                <Typography variant="h6">  {this.state.currentDate} </Typography>
                            </Grid>
                            <Grid item
                                lg={1}
                                md={1} >
                                <IconButton aria-label='next-month' className={'next-month'} onClick={this.goToNext}>
                                    <ChevronRightOutlinedIcon />
                                </IconButton>
                            </Grid>
                            <Grid item
                                md={2}
                                lg={1}>
                                <FormControl className="change-view">
                                    <InputLabel htmlFor="change-view-select" />
                                    <Select
                                        inputProps={{
                                            name: 'viewValue',
                                            id: 'change-view-select'
                                        }}
                                        native
                                        onChange={(event) => this.changeView(event.target.value)}
                                        value={this.state.viewValue}>
                                        <option value="timeGridDay">Day</option>
                                        <option value="dayGridWeek">Week</option>
                                        <option value="dayGridMonth">Month</option>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        this.changeViewToCalendar()
                                            ;
                                    }}>Calendar
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    onClick={() => {
                                        this.changeViewToResource()
                                            ;
                                    }}>Resource
                                </Button>
                            </Grid>
                        </Grid>
                        <br />
                        <FullCalendar
                            defaultView="timeGridDay"
                            displayEventTime={true}
                            eventColor={"none"}
                            eventLimit={4}
                            eventMouseEnter={this.handleToolTip}
                            eventSources={[
                                {events: this.state.calendarEvents, color: '#6FB87B'}
                            ]}
                            header={false}
                            nowIndicator={true}

                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listViewPlugin, resourceTimelinePlugin]}
                            ref={this.calendarComponentRef}
                            resourceAreaWidth={'20%'}
                            resourceOrder={'title'}
                            resources={this.state.calendarResources}
                            schedulerLicenseKey={'GPL-My-Project-Is-Open-Source'}
                            timeZone={'local'}
                            weekends={this.state.calendarWeekends} />
                    </div>
                </Paper >
            </Grid >
        );
    }
}

Scheduler.propTypes = {};

function mapStateToProps(state) {
    return {
        "courses": state.Course.NewCourseList,
        "sessions": state.Course.CourseSessions,
        "instructors": state.Users.InstructorList,

    };
}

function mapDispatchToProps(dispatch) {
    return {
        "calenderActions": bindActionCreators(calenderActions, dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Scheduler);
