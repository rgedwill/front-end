import { connect } from "react-redux";
import React, { useState } from "react";
import BackButton from "../../BackButton";
import Grid from "@material-ui/core/Grid";
import { Card, Paper, Typography, Grow } from "@material-ui/core";

import Chip from "@material-ui/core/Chip";
import CardActions from "@material-ui/core/CardActions";
import { withRouter } from "react-router-dom";



function UpcomingSessionCards(props) {
    const [value, setValue] = useState(0);
    const [userList, setUserList] = useState([])
    const [viewToggle, setViewToggle] = useState(true);

    const goToRoute = (route) => {
        props.history.push(props.match.url + route);
    }



    return (
        <Grid item xs={12} sm={3} className={"UpcomingSessionCards"} style={{ padding: "20px" }}>
            <Card key={props.user.user_id}
                style={{ cursor: "pointer" }}
                onClick={(event) => {
                    event.preventDefault();
                    goToRoute(`/${props.user.role}/${props.user.user_id}`);
                }}>
                <Grid container>
                    <Grid item sm={12}>
                        <Typography align={"center"} variant={"h5"}> Noveber 12, 2019 | 7:00 - 9:00 </Typography>
                    </Grid>
                    <Grid item sm={5}>
                        <Chip
                            style={{
                                cursor: "pointer", width: '100px',
                                height: '30px'
                            }}
                            label={"Type of course"}
                        />
                    </Grid>
                    <Grid container style={{ "paddingLeft": "1em" }}>
                        <Grid container
                            direction={"row"}
                            alignItems={'center'}
                        >
                            <Grid item >
                                <Typography variant={"h6"}> Course Name: </Typography>
                            </Grid>
                            <Grid item sm={3}>Calc 101</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Subject: </Typography>
                            </Grid>
                            <Grid item sm={4}>AP Calculus</Grid>
                        </Grid>
                        <Grid container
                            direction={"row"}
                            alignItems={"center"}
                        >
                            <Grid item>
                                <Typography variant={"h6"}> Teacher: </Typography>
                            </Grid>
                            <Grid item sm={4}>Daniel Huang</Grid>
                        </Grid>

                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
}


UpcomingSessionCards.propTypes = {};

function mapStateToProps(state) {
    return {
        instructors: state.Users.InstructorList,
        parents: state.Users.ParentList,
        students: state.Users.StudentList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(UpcomingSessionCards));
