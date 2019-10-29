import * as types from "./actionTypes";

import axios from "axios";

const instance = axios.create({
    "baseURL": "http://localhost:8000",
});

export const REQUEST_ALL = -1;

export const REQUEST_STARTED = 1;
export const REQUEST_SUCCESS = 2;
export const REQUEST_FAILED = 3;

export const wrapGet = (endpoint, [startType, successType, failType], id) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    "id": id || REQUEST_ALL,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        const requestURL = id ? `${endpoint}${id}/` : endpoint;

        try {
            const response = await instance.get(requestURL, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch ({ response }) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapPost = (endpoint, [startType, successType, failType], data) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.post(endpoint, data, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch ({ response }) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapPatch = (endpoint, [startType, successType, failType], id, data) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    id,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});

        try {
            const response = await instance.patch(`${endpoint}${id}/`, data, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
            });
            // succesful request
            newAction(successType, response);
        } catch ({ response }) {
            // failed request
            newAction(failType, response);
        }
    };

export const wrapGetNote = (endpoint, [startType, successType, failType], userID) =>
    async (dispatch, getState) => {
        // creates a new action based on the response given
        const newAction = (type, response) => {
            dispatch({
                type,
                "payload": {
                    "user_id": userID,
                    response,
                },
            });
        };

        // request starting
        newAction(startType, {});
        try {
            const response = await instance.get(endpoint, {
                "headers": {
                    "Authorization": `Token ${getState().auth.token}`,
                },
                // params: {user_id: userID}
            });
            // succesful request
            newAction(successType, response);
        } catch ({ response }) {
            // failed request
            newAction(failType, response);
        }
    };


export const fetchCourses = (id) =>
    wrapGet(
        "/courses/catalog/",
        [
            types.FETCH_COURSE_STARTED,
            types.FETCH_COURSE_SUCCESSFUL,
            types.FETCH_COURSE_FAILED,
        ],
        id,
    );

export const fetchInstructors = (id) =>
    wrapGet(
        "/account/instructor/",
        [
            types.FETCH_INSTRUCTOR_STARTED,
            types.FETCH_INSTRUCTOR_SUCCESSFUL,
            types.FETCH_INSTRUCTOR_FAILED,
        ],
        id,
    );

export const fetchStudents = (id) =>
    wrapGet(
        "/account/student/",
        [
            types.FETCH_STUDENT_STARTED,
            types.FETCH_STUDENT_SUCCESSFUL,
            types.FETCH_STUDENT_FAILED,
        ],
        id,
    );

export const fetchNotes = (userID) =>
    wrapGetNote(
        `account/note/?user_id=${userID}`,
        [
            types.FETCH_NOTE_STARTED,
            types.FETCH_NOTE_SUCCESSFUL,
            types.FETCH_NOTE_FAILED,
        ],
        userID,
    );
