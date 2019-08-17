import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as registrationActions from '../../../actions/registrationActions';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import TableRow from "@material-ui/core/TableRow";

//Material UI Imports
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import StepContent from "@material-ui/core/StepContent";
import TextField from "@material-ui/core/TextField";
import { InputValidation } from "./Validations";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import MenuItem from "@material-ui/core/MenuItem";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@material-ui/icons/Clear";

//Outside React Component
import SearchSelect from 'react-select';
import BackButton from "../../BackButton.js";

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            conditional: "",
            nextSection: false,
            activeStep: 0,
            activeSection: "",
            form: "",
            submitted: false,
        };
    }

    componentWillMount() {
        let prevState = JSON.parse(sessionStorage.getItem("form") || null);
        const formType = this.props.match.params.type;
        if (!prevState || formType !== prevState.form) {
            if (this.props.registrationForm[formType]) {
                this.setState((oldState) => {
                    let formContents = JSON.parse(JSON.stringify(this.props.registrationForm[formType]));
                    let NewState = {
                        ...oldState,
                        activeSection: formContents.section_titles[0],
                        form: formType,
                    };
                    let course = decodeURIComponent(this.props.match.params.course);
                    course = this.props.courses.find(({ course_title }) => course === course_title);
                    if (course) {
                        // convert it to a format that onselectChange can use
                        course = {
                            value: `${course.course_id}: ${course.course_title}`,
                            label: `${course.course_id}: ${course.course_title}`,
                        };
                    }
                    formContents.section_titles.forEach((title) => {
                        // create blank fields based on form type
                        NewState[title] = {};
                        // set a value for every non-conditional field (object)
                        if (Array.isArray(formContents[title])) {
                            formContents[title].forEach(({ field, type, options }) => {
                                switch (type) {
                                    case "course":
                                        NewState[title][field] = course;
                                        break;
                                    case "select":
                                        NewState[title][field] = options[0];
                                        break;
                                    case "student":
                                        NewState[title][field] = course;
                                        break;
                                    default:
                                        NewState[title][field] = null;
                                }
                            });
                        }
                        // create validated state for each field
                        NewState[`${title}_validated`] = {};
                        if (Array.isArray(formContents[title])) {
                            formContents[title].forEach((field) => {
                                NewState[`${title}_validated`][field.field] = true;
                            });
                        }
                    });
                    return NewState;
                }, () => {
                    this.setState({
                        nextSection: this.validateSection(),
                    });
                });
            }
        } else {
            this.setState(prevState);
        }
    }

    getFormObject() {
        return this.props.registrationForm[this.state.form];
    }

    getActiveSection() {
        let section = this.getFormObject()[this.state.activeSection];
        if (Array.isArray(section)) {
            return section;
        } else {
            return section[this.state.conditional]
        }
    }

    onBack() {
        // clear session storage
        sessionStorage.setItem("form", "");
    }

    getStepContent(step, formType) {
        return this.props.registrationForm[formType][step]
    }

    validateSection() {
        const currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        return (
            this.getActiveSection()
                .filter(({ required }) => required)
                .every(({ field }) => this.state[currSectionTitle][field]) &&
            Object.values(this.state[`${currSectionTitle}_validated`])
                .every((valid) => valid)
        );
    }

    getConditionalFieldFromCurrentSection() {
        let nextSectionInput = false;
        let currSectionTitle = this.state.activeSection;
        // Get input from the conditional field
        if (Array.isArray(this.getFormObject()[currSectionTitle])) {
            this.getFormObject()[currSectionTitle].some((field) => {
                if (field.conditional) {
                    nextSectionInput = this.state[currSectionTitle][field.field];
                    return true;
                } else {
                    return false;
                }
            });
        }
        return nextSectionInput;
    }

    // Progresses to next section in registration form
    handleNext() {
        const currSectionTitle = this.getFormObject().section_titles[this.state.activeStep];
        let section = this.props.registrationForm[this.state.form][this.state.activeSection];
        if (!Array.isArray(section)) {
            section = section[this.state.conditional];
        }
        section.forEach((field) => {
            this.validateField(currSectionTitle, field, this.state[currSectionTitle][field.field]);
        });
        this.setState((oldState) => {
            if (this.validateSection()) {
                if (!oldState.submitted && oldState.activeStep === this.getFormObject().section_titles.length - 1) {
                    this.props.registrationActions.submitForm(this.state);
                    return {
                        submitted: true,
                    };
                } else {
                    const conditionalField = this.getConditionalFieldFromCurrentSection(),
                        nextActiveStep = oldState.activeStep + 1,
                        nextActiveSection = this.getFormObject().section_titles[nextActiveStep];
                    let newState = {
                        activeStep: nextActiveStep,
                        activeSection: nextActiveSection,
                        conditional: conditionalField ? conditionalField : oldState.conditional,
                        nextSection: false,
                    };
                    if (conditionalField) {
                        let formContents = this.getFormObject(),
                            title = nextActiveSection;
                        // create blank fields based on form type
                        newState[title] = {};
                        formContents[nextActiveSection][conditionalField].forEach((field) => {
                            newState[title][field.field] = null;
                        });
                        // create validated state for each field
                        newState[`${title}_validated`] = {};
                        formContents[nextActiveSection][conditionalField].forEach((field) => {
                            newState[`${title}_validated`][field.field] = true;
                        });
                    }
                    return newState;
                }
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    // Regresses to previous section in registration form
    handleBack() {
        this.setState((oldState) => {
            if (oldState.activeStep !== 0 && oldState.activeSection) {
                return {
                    activeStep: oldState.activeStep - 1,
                    activeSection: this.getFormObject().section_titles[oldState.activeStep - 1],
                };
            } else {
                return {};
            }
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            });
        });
    }

    handleReset() {
        this.setState({ activeStep: 0 });
    }

    handleFieldUpdate(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            oldState[sectionTitle][field.field] = fieldValue;
            return oldState;
        });
    }

    validateField(sectionTitle, field, fieldValue) {
        this.setState((oldState) => {
            if (!fieldValue) { // if empty field
                oldState[`${sectionTitle}_validated`][field.field] = !field.required;
            } else if (InputValidation(fieldValue, field.type)) { // if valid input
                let isValid = true;
                if (field.type === "number") {
                    // parse if number
                    oldState[sectionTitle][field.field] = parseInt(fieldValue, 10);
                } else if (field.type === "email") {
                    let emails;
                    if (field.field === "Student Email") {
                        emails = this.props.students.map(({ email }) => email);
                    } else if (field.field === "Parent Email") {
                        emails = this.props.parents.map(({ email }) => email);
                    }
                    isValid = !emails.includes(fieldValue);
                }
                oldState[`${sectionTitle}_validated`][field.field] = isValid;
            } else {
                oldState[`${sectionTitle}_validated`][field.field] = false;
            }
            return oldState;
        }, () => {
            this.setState({
                nextSection: this.validateSection(),
            }, () => {
                sessionStorage.setItem("form", JSON.stringify(this.state));
            });
        });
    }

    onSelectChange(value, label, field) {
        console.log(value);
        this.setState((OldState) => {
            let NewState = OldState;
            NewState[label][field.field] = value;
            return NewState;
        }, () => {
            this.validateField(this.state.activeSection, field, value);
        });
    }

    renderField(field, label, fieldIndex) {
        let fieldTitle = field.field;
        switch (field.type) {
            case "select":
                return <FormControl className={"form-control"}>
                    <InputLabel htmlFor={fieldTitle}>{fieldTitle}</InputLabel>
                    <Select
                        value={this.state[label][fieldTitle]}
                        onChange={({ target }) => {
                            this.onSelectChange(target.value, label, field);
                        }}>
                        {
                            field.options.map((option) => (
                                <MenuItem value={option} key={option}>
                                    <em>{option}</em>
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>;
            case "course":
                const courseList = this.props.courses
                    .filter(({ capacity, filled }) => capacity > filled)
                    .map(({ course_id, course_title }) => ({
                        value: `${course_id}: ${course_title}`,
                        label: `${course_id}: ${course_title}`,
                    }));
                return <SearchSelect
                    value={this.state[label][fieldTitle]}
                    onChange={(value) => {
                        this.onSelectChange(value, label, field);
                    }}
                    options={courseList}
                    className="search-options" />;
            case "student":
                const studentList = this.props.students
                    .map(({ user_id, name }) => ({
                        value: `${user_id}: ${name}`,
                        label: `${user_id}: ${name}`,
                    }));
                studentList.unshift({
                    value: `${-1}: ${'None'}`,
                    label: `${-1}: ${'None'}`,
                });
                return (<div>
                     <Grid container className={"student-align"} spacing={20}>
                    <SearchSelect
                        value={this.state[label][fieldTitle]}
                        onChange={(value) => {
                            this.onSelectChange(value, label, field);
                        }}
                        options={studentList}
                        className="search-options" />
                    <RemoveIcon color="primary" aria-label="Add" variant="extended"
                        className="button-remove-student"
                        onClick={(event) => {
                            event.preventDefault();
                            //deletes answer field from state
                            this.removeField(fieldIndex);
                            this.setState((prevState) => {
                                return prevState;
                            })
                        }}>
                    </RemoveIcon>
                    </Grid>
                </div>);

            case "teacher":
                let teacherList = this.props.teachers;
                teacherList = teacherList.map((teacher) => {
                    return {
                        value: teacher.id.toString() + ": " + teacher.name,
                        label: teacher.id.toString() + ": " + teacher.name,
                    }
                });
                return <SearchSelect
                    onChange={(value) => {
                        this.onSelectChange(value, label, field);
                    }}
                    value={this.state[label][fieldTitle]}
                    options={teacherList}
                    className="search-options" />
            default:
                return <TextField
                    label={field.field}
                    multiline
                    // className={this.state[label+"_validated"][field.field] ? "": "error"}
                    margin="normal"
                    value={this.state[label][field.field]}
                    error={!this.state[label + "_validated"][field.field]}
                    helperText={!this.state[label + "_validated"][field.field] ? field.field + " invalid" : ""}
                    type={field.type === "int" ? "Number" : "text"}
                    required={field.required}
                    fullWidth={field.full}
                    onChange={(e) => {
                        e.preventDefault();
                        this.handleFieldUpdate.bind(this)(label, field, e.target.value);
                    }}
                    onBlur={(e) => {
                        e.preventDefault();
                        this.validateField.bind(this)(label, field, e.target.value);
                    }}
                />
        }
    }

    addField(field, fieldIndex) {
        const currentForm = this.getFormObject();
        let param = [this.state.form, this.state.activeSection, fieldIndex];
        if (!Array.isArray(currentForm[this.state.activeSection])) {
            param.splice(2, 0, this.state.conditional);
        }
        this.props.registrationActions.addField(param);
        // for some reason it isn't rerendering automatically
        this.forceUpdate();
    }

    removeField(fieldIndex) {
        let fieldtoDeleteKey = this.props.registrationForm[this.state.form][this.state.activeSection][fieldIndex].field;
        this.setState((prevState)=>{
            console.log(prevState[prevState["activeSection"]][fieldtoDeleteKey]);
            delete prevState[prevState["activeSection"]][fieldtoDeleteKey]; 
            console.log(prevState);
            return prevState;
        });
        console.log(this.state[this.state.activeSection]);
        const currentForm = this.getFormObject();
        let param = [this.state.form, this.state.activeSection, fieldIndex];
        this.props.registrationActions.removeField(param);
        this.forceUpdate();
    }

    renderForm() {
        const { activeSection, activeStep, conditional, nextSection } = this.state,
            currentForm = this.props.registrationForm[this.state.form],
            steps = currentForm.section_titles;
        let section = currentForm[activeSection];
        if (!Array.isArray(section)) {
            section = section[conditional];
        }
        return (
            <Stepper activeStep={activeStep} orientation="vertical" className="form-section">
                {
                    steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {
                                    section.map((field, j) => {
                                        // number of fields of the same type as the current field
                                        const numSameTypeFields = section.reduce((count, otherField) => field.name === otherField.name ? count + 1 : count, 0),
                                            reversedSection = [...section].reverse(),
                                            lastFieldOfType = reversedSection.find((otherField) => otherField.name === field.name);
                                        return (
                                            <div key={j} className="fields-wrapper" style={{}}>
                                                <Grid container className={"student-align"} spacing={20}>
                                                    {this.renderField(field, label, j)}
                                                </Grid>
                                                <br />
                                                {
                                                    numSameTypeFields < field.field_limit &&
                                                    field === lastFieldOfType &&
                                                    <Fab color="primary" aria-label="Add" variant="extended"
                                                        className="button add-student"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            this.addField(field.field, j);
                                                        }}>
                                                        <AddIcon />
                                                        Add {field.field}
                                                    </Fab>
                                                }

                                            </div>
                                        );
                                    })
                                }
                                <div className="controls">
                                    <Button
                                        disabled={activeStep === 0}
                                        color="secondary"
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleBack();
                                        }}
                                        className={`button ${activeStep === 0 ? "hide" : ""}`}>
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={!nextSection}
                                        onClick={(event) => {
                                            event.preventDefault();
                                            this.handleNext();
                                        }}
                                        className="button">
                                        {activeStep === steps.length - 1 ? "Finish" : "Next"}
                                    </Button>
                                </div>
                            </StepContent>
                        </Step>
                    ))
                }
            </Stepper>
        );
    }

    // view after a submitted form
    renderSubmitted() {
        return (
            <div>
                Your submission has been stored. A confirmation email will be sent.
            </div>
        );
    }

    render() {
        return (
            <Grid container className="">
                <Grid item xs={12}>
                    <Paper className={"registration-form"}>
                        <BackButton
                            warn={true}
                            onBack={this.onBack}
                            alertMessage={"Do you want to save your changes?"}
                            alertConfirmText={"Yes, save changes"}
                            confirmAction={"saveForm"}
                            alertDenyText={"No, don't save changes"}
                            denyAction={"default"}
                        />
                        <Typography className={"heading"} align={"left"}>
                            {this.props.match.params.course ? `${decodeURIComponent(this.props.match.params.course)} ` : ""}
                            {this.props.match.params.type} Registration
                        </Typography>
                        {
                            !this.state.submitted ?
                                this.props.registrationForm[this.state.form] ?
                                    this.renderForm.bind(this)() :
                                    <Typography>
                                        Sorry! The form is unavailable.
                                    </Typography>
                                : this.renderSubmitted()
                        }
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

function mapStateToProps(state) {
    return {
        courses: state.Registration["course_list"],
        courseCategories: state.Registration["categories"],
        registrationForm: state.Registration["registration_form"],
        parents: state.Registration["parent_list"],
        students: state.Registration["student_list"],
        teachers: state.Registration["teacher_list"],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        registrationActions: bindActionCreators(registrationActions, dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Form);