import React, { PureComponent, Component } from 'react'
import { TextInput, StyleSheet, Dimensions } from 'react-native';
import { View, Button, Text, Container, Icon } from 'native-base';
import Drawer from 'react-native-drawer';
import SideBar from './SideBar';
import Settings from './Settings';
import Terms from './Terms';
import Driversignup from './DriverSignup';
import Signup from './Signup';
import { Trips } from './Trips';
import { StackNavigator } from 'react-navigation';
import { ApiService } from './services/apis';
import Map from './Map';

export class CarBooking extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            userObj: {},
            demoUser: false
        }
    }

    closeDrawer = () => {
        CarBooking.drawer.close();
    }
    openDrawer = () => {
        CarBooking.drawer.open();
    }
    gotoLogin = () => {
        this.props.gotoLogin();
    }
    static drawer = {}
    static navigator = {}

    componentDidMount() {
        ApiService._authenticateUser.bind(this)().then(res => {
            console.log(res)
            if (res.isAuthenticated) {
                this.setState({ userObj: res.userObj, demoUser: false })
            }
            else {
                let newState = { ...this.state }
                newState.userObj.firstName = "Demo";
                newState.demoUser = true;
                this.setState(newState);
            }
        });
    }

    render() {
        return (
            <Container>
                <Drawer ref={ref => {
                    CarBooking.drawer = ref
                }}
                    type="overlay"
                    openDrawerOffset={Dimensions.get('window').width * .3}
                    panOpenMash={.3}
                    content={<SideBar
                        demoUser={this.state.demoUser}
                        gotoLogin={this.gotoLogin}
                        user={this.state.userObj}
                        navigate={a => {
                            CarBooking.navigator.navigate(a)
                        }} onClose={this.closeDrawer} />}>
                    <ModalStack />
                </Drawer>
            </Container>
        )
    }
}

export default class Home extends PureComponent {
    static navigationOptions = {
        title: 'Home',
        headerLeft: <Button style={{ backgroundColor: 'black' }} light onPress={() => { CarBooking.drawer.open(); }}><Icon name="menu" style={{ color: '#fff' }} /></Button>
    }
    render() {
        CarBooking.navigator = this.props.navigation
        return (
            <View style={{flex: 1}}><Map /></View>
        )
    }
}
const ModalStack = StackNavigator({
    Home: {
        screen: Home
    },
    Settings: {
        screen: Settings
    },
    Trips: {
        screen: Trips
    },
    Terms: {
        screen: Terms
    },
    Driversignup: {
        screen: Driversignup
    },
    Signup: {
        screen: Signup
    }
}, {
        navigationOptions: {
            headerStyle: {
                backgroundColor: 'black'
            },
            headerTitleStyle: {
                color: '#fff'
            }
        }
    });