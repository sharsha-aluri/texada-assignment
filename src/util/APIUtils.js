import { AUTHENTICATED_USER_ID, DATA } from '../constants';
import userData from '../userdata.json';
import data from '../data.json';
import Moment from 'moment';

export function loginUser(loginRequest) {
    var loggedInUser;

    for (const [index, user] of userData.entries()) {
        if (user.username === loginRequest.username && user.password === loginRequest.password) {
            loggedInUser = user;
        }
    }

    return loggedInUser;
}

export function getCurrentUser() {
    const userId = localStorage.getItem(AUTHENTICATED_USER_ID);
    if (userId) {
        var loggedInUser;

        for (const [index, user] of userData.entries()) {
            if (user.userid === parseInt(userId)) {
                loggedInUser = user;
            }
        }

        return loggedInUser;
    }

    return null;
}

export function getAirplaneData() {
    const localData = localStorage.getItem(DATA);
    const saveData = localData == null;
    const planeData = saveData ? data : JSON.parse(localData);

    if(planeData){
        const sortedData = [].concat(planeData)
        .sort(function(a, b){
            if(a.description < b.description) { return -1; }
            if(a.description > b.description) { return 1; }
            return 0;
        })
        const newData = [];
        var tableId = 1;
        for (const [index, airplane] of sortedData.entries()) {
            const newPlane = Object.assign({}, airplane);
            newPlane["tableId"] = tableId;
            tableId++;
            newData.push(newPlane);
        }

        if(saveData) {
            localStorage.setItem(DATA, JSON.stringify(newData));
        }

        return newData;
    }
    return null;
}

export function addAirplaneData(airplaneData) {
    const localData = localStorage.getItem(DATA);

    if(localData) {
        const dataArray = JSON.parse(localData);
        Moment.locale('en');
        airplaneData["datetime"] = Moment(new Date().toLocaleString()).format('YYYY-MM-DDThh:mm:ssZ');
        dataArray.push(airplaneData);

        localStorage.setItem(DATA, JSON.stringify(dataArray));
    }
}

export function updateAirplaneData(airplaneData) {
    const localData = localStorage.getItem(DATA);

    if(localData) {
        Moment.locale('en');
        airplaneData["datetime"] = Moment(new Date().toLocaleString()).format('YYYY-MM-DDThh:mm:ssZ');

        const dataArray = JSON.parse(localData);

        const updatedData = dataArray.map((obj, index) => {
            return obj.tableId === airplaneData.tableId ? airplaneData : obj;
        });

        localStorage.setItem(DATA, JSON.stringify(updatedData));
    }
}

export function deleteAirplaneData(tableId) {
    const localData = localStorage.getItem(DATA);

    if(localData) {
        const dataArray = JSON.parse(localData);
        var deleteIndex = -1;
        for (const [index, airplane] of dataArray.entries()) {
            if(airplane.tableId === tableId) {
                deleteIndex = index;
            }
        }

        if(deleteIndex > -1) {
            dataArray.splice(deleteIndex, 1);
        }

        localStorage.setItem(DATA, JSON.stringify(dataArray));
    }
}
