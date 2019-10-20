import {useSelector} from "react-redux";

export const useLoginStatus = () => {
    const userToken = useSelector(({"auth": {token}}) => token);
    const loginStatus = useSelector(({"RequestStatus": {login}}) => login);
    return userToken && loginStatus && (200 <= loginStatus && loginStatus < 299);
};
