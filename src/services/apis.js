import axios from 'axios';
import { AsyncStorage } from "react-native";
export class ApiService {
    static hostName = "http://62.151.176.35"
    static baseURL = ApiService.hostName+":8080/wego/";

    static async _authenticateUser() {
        await AsyncStorage.removeItem('user');
        try {
            let user = await AsyncStorage.getItem('user');
            if (user) {
                user = JSON.parse(user);
                if (user.id)
                    return { isAuthenticated: true, userObj: user };
                else return { isAuthenticated: false };
            }
            return { isAuthenticated: false };
        }
        catch (error) {
            console.log(JSON.stringify(error))
            return { isAuthenticated: false };
        }
    }

    static async _createDemoUser(){
        await AsyncStorage.removeItem('user');
    }

    static async _registerDriver(dataObj) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Accept', "*/*");
        let user = await AsyncStorage.getItem('user');
        user = JSON.parse(user);
        console.log(user, dataObj);

        dataObj.user.id = user.id;
        try {
            //get local storage id
            let response = fetch(ApiService.baseURL+'api/drivers', {
                method: "post",
                body: JSON.stringify(dataObj),
                headers: myHeaders,
                withCredentials: true
            }).then((res => {
                return res
            }))
            return response;
        }
        catch (error) {
            console.log(JSON.stringify(error.response))
            return error.response;
        }
    }

    static async _registerUser(dataObj) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Accept', "application/json");
        let reqURL = `${ApiService.baseURL}api/register`;
        let response = fetch(reqURL, {
            method: "post",
            body: JSON.stringify(dataObj),
            headers: myHeaders,
            withCredentials: true
        }).then((res => {
            console.log(res)
            // // let id = JSON.parse(res._bodyText);
            AsyncStorage.setItem('user', res._bodyText, () => {
            });
            //    // Error retrieving data
            return res
        })).catch(err => err)
        return response;
    }

    static async _updateUser(dataObj) {
        var myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        myHeaders.append('Accept', "*/*");
        let response = fetch(ApiService.baseURL+'api/users', {
            method: "put",
            body: JSON.stringify(dataObj),
            headers: myHeaders,
            withCredentials: true
        }).then((res => {
            console.log(res)
            // // let id = JSON.parse(res._bodyText);
            AsyncStorage.setItem('user', res._bodyText, () => {
            });
            //    // Error retrieving data
            return res
        })).catch(err => err)
        return response;
    }

    static async _getTerms() {
        try {
            let response = await axios({
                method: 'get',
                url: ApiService.baseURL+'api/terms',
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
                withCredentials: true
            })
            return response;
        }
        catch (error) {
            console.log(JSON.stringify(error.response))
            return error.response;
        }
    }

    static validateEmail(email) {
        var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return reg.test(email);
    }
}