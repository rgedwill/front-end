import * as actions from "./../actions/actionTypes";
import initialState from "./initialState";

export default function search(
    state = initialState.SearchResults,
    {payload, type}
) {
    if (payload && payload.noChangeSearch) {
        return state;
    }
    switch (type) {
        case actions.GET_ACCOUNT_SEARCH_QUERY_SUCCESS: {
            const {data} = payload.response;
            return JSON.parse(JSON.stringify({
                ...state,
                "accountResultsNum": data.count,
                "accounts": {
                    ...state.accounts,
                    [data.page]: data.results,
                },
            }));
        }
        case actions.GET_COURSE_SEARCH_QUERY_SUCCESS: {
            const {data} = payload.response;
            return {
                ...state,
                "courseResultsNum": data.count,
                "courses": {
                    ...state.courses,
                    [data.page]: data.results,
                },
            };
        }
        default:
            return state;
    }
}
