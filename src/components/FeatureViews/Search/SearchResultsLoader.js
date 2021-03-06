import PropTypes from "prop-types";
import React from "react";

import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import LessResultsIcon from "@material-ui/icons/KeyboardArrowLeft";
import MoreResultsIcon from "@material-ui/icons/KeyboardArrowRight";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import "./Search.scss";
import AccountsCards from "./cards/AccountsCards";
import CoursesCards from "./cards/CoursesCards";

const SearchResultsLoader = ({numResults, query, accountPage, coursePage}) => (
    <Grid
        className="search-results"
        container>
        <Grid
            item
            xs={12}>
            <Paper className="main-search-view" >
                <Grid
                    className="searchResults"
                    item
                    xs={12}>
                    <Typography
                        align="left"
                        className="search-title"
                        variant="h3">
                        {numResults} Search Results for "{query}"
                    </Typography>
                </Grid>
                <div className="account-results-wrapper">
                    <Grid
                        item
                        xs={12}>
                        <hr />
                        <Grid
                            alignItems="center"
                            container
                            direction="row"
                            justify="space-between">
                            <Grid
                                className="searchResults"
                                item>
                                <Typography
                                    align="left"
                                    className="resultsColor"
                                    gutterBottom>
                                        Accounts
                                </Typography>
                            </Grid>
                            <Grid item >
                                <Chip
                                    className="searchChip"
                                    label="See All Accounts" />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            spacing={16}>
                            {
                                [1, 2, 3, 4].map((account) => (
                                    <Grid
                                        item
                                        key={account}
                                        sm={3}>
                                        <AccountsCards
                                            isLoading />
                                    </Grid>
                                ))
                            }
                        </Grid>
                        <div className="results-nav">
                            {
                                <IconButton
                                    className="less"
                                    disabled>
                                    <LessResultsIcon />
                                </IconButton>
                            }
                            {accountPage}
                            {
                                <IconButton
                                    className="more"
                                    disabled>
                                    <MoreResultsIcon />
                                </IconButton>
                            }

                        </div>
                    </Grid>
                </div>
                <div className="course-results-wrapper">
                    <hr />
                    <Grid
                        item
                        xs={12}>
                        <Grid
                            alignItems="center"
                            container
                            direction="row"
                            justify="space-between">
                            <Grid
                                className="searchResults"
                                item>
                                <Typography
                                    align="left"
                                    className="resultsColor" >
                                       Courses
                                </Typography>
                            </Grid>
                            <Grid
                                item
                                style={{"paddingRight": "1vh"}}>
                                <Chip
                                    className="searchChip"
                                    label="See All Courses" />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            spacing={8}>
                            {[1, 2, 3, 4].map((course) => (
                                <CoursesCards
                                    isLoading
                                    key={course} />))}
                        </Grid>
                    </Grid>
                    <div className="results-nav">
                        <IconButton
                            className="less"
                            disabled>
                            <LessResultsIcon />
                        </IconButton>
                        {coursePage}
                        <IconButton
                            className="more"
                            disabled>
                            <MoreResultsIcon />
                        </IconButton>
                    </div>
                </div>
            </Paper>
        </Grid>
    </Grid>
);

SearchResultsLoader.propTypes = {
    "accountPage": PropTypes.number.isRequired,
    "coursePage": PropTypes.number.isRequired,
    "numResults": PropTypes.number.isRequired,
    "query": PropTypes.string.isRequired,
};

export default SearchResultsLoader;
