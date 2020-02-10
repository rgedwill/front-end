import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { DialogActions, DialogContent } from "@material-ui/core";
import React, { useEffect, useMemo, useState } from "react";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Grid from "@material-ui/core/Grid";
import './Accounts.scss';


function OutOfOffice(props) {
    console.log(props);
    const [dialog, setdialog] = useState(props.open);
    const [date, setdate] = useState(null);
    const handleChange = event => {
        setdate(event.target.value);
    };
    const useStyles = makeStyles({
        styles: {
            minHeight: '80vh',
            maxHeight: '80vh',
        }
    });
    const classes=useStyles();
    return (
        <Dialog className={"oooDialog"}     
            classes={{paper:classes.styles}}
            aria-labelledby="simple-dialog-title" open={props.open}
            fullWidth={true}
            contentStyle={{ width: "100%", maxWidth: "none" }}
        >
            <DialogContent>
                <div>
                    Schedule OOO
                </div>
                <div>
                    Instructor:
                </div>
                <Grid container item md={12}>
                    <Grid item md={3}>
                        <div>
                            Select OOO Start Date
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO End Date
                            </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={6}></Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO Start Date
                        </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={3}>
                        <div>
                            Select OOO End Date
                            </div>
                        <Select
                            labelId="demo-simple-select-label"
                            label="Date"
                            onChange={handleChange}
                        >
                            <MenuItem value={10}>Ten</MenuItem>
                            <MenuItem value={20}>Twenty</MenuItem>
                            <MenuItem value={30}>Thirty</MenuItem>
                        </Select>
                    </Grid>
                    <Grid item md={6}></Grid>
                </Grid>
                <Grid container md={12}>
                    <Grid item md={8}>

                    </Grid>
                    <Grid item md={2}>
                        <Button onClick={props.handleclose}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item md={2}>
                        <Button onClick={props.handleclose}>
                            Save OOO
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );


}
const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default OutOfOffice;
