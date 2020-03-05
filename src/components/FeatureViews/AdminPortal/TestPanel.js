import React, {useEffect, useMemo, useState} from "react";
import {connect, useDispatch, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import * as adminActions from "../../../actions/adminActions";

import ReactDOM from 'react-dom';

import PanelManager from "./PanelManager";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import {Button, Typography} from "@material-ui/core";

function TestPanel() {
    const dispatch = useDispatch();
    const api = useMemo(
        () => ({
            ...bindActionCreators(adminActions, dispatch),
        }),
        [dispatch]
    );

    const fields = [
        {
            "name": "Category Name",
            "col-width": 3,
            
        },
        {
            "name": "Description",
            "col-width": 7,
            "editable": "true"
        },
        {
            "name": "Edit",
            "align": "center",
            "col-width": 2
        }
    ];

    const [categoryName, setCategoryName] = useState('');
    const [categoryDescription, setCategoryDescription] = useState('');
    const [categoryList, setCategoryList] = useState([]);

    const categories = useSelector(({Course}) => Course.CourseCategories);
    const categoryStatus = useSelector(({RequestStatus}) => RequestStatus.category)

    useEffect(()=>{
        api.fetchCategories();
    },[api]);

    useEffect(()=>{
        if(categories.length !== categoryList.length){
            let parsedCategoryList = categories.map((category)=>({
                            ...category,
                            editing: false,
                        }));
            setCategoryList(parsedCategoryList);
        }
    }, [categories]);

    const handleChange = (field) => (e) =>{
        switch(field){
            case "name":{
                setCategoryName(e.target.value);
                break;
            }
            case "description":{
                setCategoryDescription(e.target.value);
                break;
            }
        }
    };
    const submitCategory = () => (e) =>{
        e.preventDefault();
        if(categoryName !== ""){
            api.addCategory(categoryName, categoryDescription);
            setCategoryName("");
            setCategoryDescription("");
        }
    };
    const TestForm = () => {
        return (
            <Paper className={"test-row new-test"}>
                <Grid container alignItems={"center"}>
                    <Grid item xs={3}>
                        <TextField
                            className={"field"}
                            label="Category Name"
                            value={categoryName}
                            onChange={handleChange("name")}
                            required={true}
                        />
                    </Grid>
                    <Grid item xs={7}>
                        <TextField
                            className={"field"}
                            multiline={true}
                            label="Category Description"
                            value={categoryDescription}
                            onChange={handleChange("description")}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Button className="add-category"
                                onClick={submitCategory()}>
                                Add Category
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
    return (
        <div>
        {TestForm()}
        <br />
        <PanelManager
            fields={fields}
            categories={categories}
        />
            </div>
    )
}

export default TestPanel