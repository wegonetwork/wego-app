import React, { PureComponent } from 'react'
import { View, StyleSheet, Image, ToastAndroid } from 'react-native';
import { Container, Header, Content, Input, Item, Text, Button, Icon, Form } from 'native-base';
import { ApiService } from './services/apis';

export default class Signup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userEmail: ' ',
            userPassword: ' ',
            firstName: ' ',
            lastName: ' ',
            loading: false
        }
    }

    static navigationOptions = (that) => ({
        title: 'Settings',
        headerLeft: <Button style={{ backgroundColor: 'black' }}
            light onPress={() => { that.navigation.goBack() }}>
            <Icon name="ios-arrow-back" style={{ color: '#fff' }} />
        </Button>
    })

    disableSubmit = () => {
        if (this.state.userEmail.trim() == "" || (this.state.userEmail.trim() != "" && !ApiService.validateEmail.bind(this)(this.state.userEmail)) || 
            this.state.userEmail.trim() == "" || this.state.userPassword.trim() == "" ||
            this.state.lastName.trim() == "" || this.state.firstName.trim() == "" || this.state.loading) {
            return true;
        }
        return false;
    }

    loginUser = () => {
        console.log("loggin in");
        this.props.submit();
    }
    createDemoUser = () => {
        ApiService._createDemoUser.bind(this)();
        this.loginUser();
    }

    signupUser() {

        if (!this.disableSubmit) {
            ToastAndroid.show('Please fill all fields !', ToastAndroid.SHORT);
            return false;
        }
        let data = {
            activated: true,
            authorities: ["ROLE_USER"],
            email: this.state.userEmail,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            login: this.state.userEmail,
            password: this.state.userPassword
        }

        
        this.setState({loading: true})

        ApiService._registerUser.bind(this)(data).then(res => {
            if (res.status == 201) {
                ToastAndroid.show('Successfully signed in!', ToastAndroid.LONG);
                this.loginUser();
            }
            else ToastAndroid.show(res.data.toString().length < 100 ? res.data.toString() : 'Something went wrong!', ToastAndroid.LONG);
            this.setState({loading: false})
        });
    }

    render() {
        return (
            <View style={styles.container}>

                <View style={styles.imgContainer}>
                    <Image
                        source={require('./assests/_logo.jpg')}
                    />
                </View>

                <Form>
                    <Item style={styles.inputContainer}>
                        <Input placeholder="First Name" onChangeText={(text) => this.setState({ firstName: text })} />
                    </Item>

                    <Item style={styles.inputContainer}>
                        <Input placeholder="Last Name" onChangeText={(text) => this.setState({ lastName: text })} />
                    </Item>

                    <Item style={styles.inputContainer}>
                        <Input placeholder="Email" onChangeText={(text) => this.setState({ userEmail: text })} />
                    </Item>

                    <Item style={styles.inputContainer}>
                        <Input placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.setState({ userPassword: text })} />
                    </Item>

                    <Button block dark 
                    disabled={this.disableSubmit()}
                        style={{ alignSelf: 'center', marginTop: 20, width: '95%' }}
                        onPress={() => this.signupUser()}>
                        <Text>Sign up</Text>
                    </Button>

                    <Button block dark 
                        style={{ alignSelf: 'center', marginTop: 10, width: '95%' }}
                        onPress={() => this.createDemoUser()}>
                        <Text>Demo</Text>
                    </Button>
                </Form>

                <Text ></Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgContainer: {
        marginTop: 70,
        alignSelf: 'center',
        marginBottom: 20,
    },
    inputContainer: {
        marginTop: 2,
        marginLeft: 4
    }
})