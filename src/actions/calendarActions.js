import * as types from './actionTypes';
import {wrapGet} from "./apiActions";

export function fetchTeacherAvailabilities(event){

}

export function addEvent(event) {
    return { type: types.ADD_EVENT, payload: event };
}

export function deleteEvent(event) {
    return { type: types.DELETE_EVENT, payload: event }
}

export function filterEvent(event) {
    return { type: types.FILTER_EVENT, payload: event }
}

export const fetchSessions = (config) => wrapGet(
    "/scheduler/session/",
    [
        types.GET_SESSIONS_STARTED,
        types.GET_SESSIONS_SUCCESS,
        types.GET_SESSIONS_FAILED,
    ],
    {
        config:config,
    }
)