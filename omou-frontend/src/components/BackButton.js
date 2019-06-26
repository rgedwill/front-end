import React, {Component} from "react";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";

import BackArrow from "@material-ui/icons/ArrowBack";
import Modal from "@material-ui/core/Modal";
import Button from "@material-ui/core/Button";
import {Typography} from "@material-ui/core";

class BackButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            alert: false,
        };
    }

    handleClick() {
        if (this.props.warn) {
            this.setState({
                alert: true,
            });
        } else {
            this.goBack();
        }
    }

    hideWarning() {
        this.setState({
            alert: false,
        });
    }

    goBack() {
        this.props.onBack && this.props.onBack(); // only call the function if defined
        this.props.history.goBack();
    }

    saveForm(){
        //enter future code to save form
    }

    confirmAction(actionName){
        //actionName is a string
        switch(actionName){
            case "saveForm":
                this.saveForm();
            break;
        } 
        this.goBack();
    }

    denyAction(actionName){
        // switch(actionName){
            //future switch statement for denyAction functions
        // }
        this.goBack();
    }

    render() {
        return (
            <div>
                <div className="control course"
                   onClick={this.handleClick.bind(this)}
                       >
                    <BackArrow className="icon" />
                    <div className="label">Back</div>
                </div>
                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.alert}
                    onClick={this.hideWarning.bind(this)}>
                    <div className="exit-popup">
                        <Typography variant="h6" id="modal-title">
                            {this.props.alertMessage || "Are you sure you want to leave unsaved changes?"}
                        </Typography>
                        <Button
                            onClick={(e)=>{ e.preventDefault();
                                this.denyAction.bind(this)(this.props.denyAction)}} //calls denyAction
                            color="secondary"
                            className="button secondary">
                            {this.props.alertDenyText || "No, leave me here"}
                        </Button>
                        <Button
                            onClick={(e)=>{ e.preventDefault();
                                this.confirmAction.bind(this)(this.props.confirmAction)}} //calls confirmAction
                            color="primary"
                            className="button primary">
                            {this.props.alertConfirmText || "Yes, take me back"}
                        </Button>
                    </div>
                </Modal>
            </div>
        );
    }
}

BackButton.propTypes = {
    history: PropTypes.shape({
        goBack: PropTypes.func.isRequired,
    }).isRequired,
    alertConfirmText: PropTypes.string,
    onBack: PropTypes.func,
    alertMessage: PropTypes.string,
    warn: PropTypes.bool,
    alertDenyText: PropTypes.string,
    alertConfirmAction: PropTypes.string,
    alertDenyAction: PropTypes.string,
};

export default withRouter(BackButton);
