import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { CarBooking } from './Home';
import Signup from './Signup';
import { ApiService } from './services/apis';

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            isAuthenticated: false,
            loader: true
        }
    }

    loginUser = () => {
        this.setState({ loader: false, isAuthenticated: true });
    }

    gotoLogin = () => {
        this.setState({ loader: false, isAuthenticated: false });
    }

    componentDidMount() {
        ApiService._authenticateUser.bind(this)().then(res => {
            if (res.isAuthenticated)
                this.loginUser();
            else  this.setState({ loader: false, isAuthenticated: false });
        });
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.state.loader ?
                    <Text>Loading</Text> :
                    this.state.isAuthenticated ?
                        <CarBooking gotoLogin={this.gotoLogin}/> :
                        <Signup submit={this.loginUser} />}
            </View>
        )
    }
}