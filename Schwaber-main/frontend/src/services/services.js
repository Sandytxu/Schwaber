import axios from "axios";

const {
    REACT_APP_PLANNER_API,
    REACT_APP_ALTERNATIVE_PLANNER_API
} = process.env;


export const login = async (username, password) => {
    const queryUrl = REACT_APP_PLANNER_API + "/auth/login";
    const res = await axios.post(queryUrl, { username, password }, { withCredentials: true });
    return res.data;
};

export const getEvents = async () => {
    const queryUrl = REACT_APP_ALTERNATIVE_PLANNER_API + "/calendar/events";
    const res = await axios.get(queryUrl, { withCredentials: true });
    return res.data;
};

export const check = async () => {
    const queryUrl = REACT_APP_PLANNER_API + "/auth/check";
    const res = await axios.get(queryUrl, { withCredentials: true });
    return res.data;
};