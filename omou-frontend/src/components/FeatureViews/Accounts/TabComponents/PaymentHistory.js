import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {TableBody, TableHead} from "@material-ui/core";
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";

class PaymentHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments:[],
        };
    }

    componentWillMount(){
        this.setState(()=>{
            let userPayments = Object.keys(this.props.payments[this.props.user_id]).map((courseID)=>{
                let coursePayments = this.props.payments[this.props.user_id][courseID];
               coursePayments = Object.keys(coursePayments).map((subPayID)=>{
                    return {
                        ...coursePayments[subPayID],
                        payment_id: this.props.user_id.toString() + courseID.toString() + subPayID.toString(),
                        course_id:courseID,
                    };
                });
               return coursePayments;
            });
            let allUserPayments = [];
            userPayments.forEach((coursePaymentsList)=>{
               allUserPayments = allUserPayments.concat(coursePaymentsList);
            });
            return {
                payments : allUserPayments,
            };
        });
    }

    render() {
        let numericDateString = (date)=>{
            let DateObject = new Date(date),
                numericOptions = { year: "numeric", month: "numeric", day: "numeric"};
            return DateObject.toLocaleDateString("en-US", numericOptions);
        };
        console.log(this.state.payments);
        return(<Grid item md={12}>
            <Table>
                <TableHead>
                    <TableCell>ID</TableCell>
                    <TableCell>Transaction Date</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Method</TableCell>
                </TableHead>
                <TableBody>
                    {
                        this.state.payments.map((payment)=>{
                            return <TableRow key={payment.payment_id}>
                                <TableCell>
                                    {payment.payment_id}
                                </TableCell>
                                <TableCell>
                                    {numericDateString(payment.date)}
                                </TableCell>
                                <TableCell>
                                    {this.props.courses[payment.course_id].title}
                                </TableCell>
                                <TableCell>
                                    {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}
                                </TableCell>
                            </TableRow>
                        })
                    }
                </TableBody>
            </Table>
        </Grid>)
    }

}

PaymentHistory.propTypes = {};

function mapStateToProps(state) {
    console.log(state);
    return {
        payments:state.Payments,
        courses:state.Course.NewCourseList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentHistory);