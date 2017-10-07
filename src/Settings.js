import React, { PureComponent } from 'react'
import { View, ToastAndroid } from 'react-native';
import { Container, Header, Content, Input, Item, Text, Button, Icon, Form } from 'native-base';
import { ApiService } from './services/apis';

export default class Settings extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      firstName: "",
      lastName: "",
      userEmail: "",
      userObj: {},
      loader: true,
      isDemoUer: false
    }
  }
  componentDidMount() {
    ApiService._authenticateUser.bind(this)().then(res => {
      if (res.isAuthenticated)
        this.setState({ userObj: res.userObj })
      else {
        this.setState({ isDemoUer: true });
      }
    });
  }

  disableSubmit = () => {
    if (this.state.userEmail.trim() == "" || (this.state.userEmail.trim() != "" && !ApiService.validateEmail.bind(this)(this.state.userEmail)) ||
      this.state.lastName.trim() == "" || this.state.firstName.trim() == "" || this.state.isDemoUer) {
      return true;
    }
    return false;
  }
  
  updateUser = () => {
    if (!this.disableSubmit) {
      ToastAndroid.show('Please fill all fields !', ToastAndroid.SHORT);
      return false;
    }

    console.log(this.state.userObj)
    let dataObj = {
      "id": this.state.userObj.id,
      "login": this.state.userObj.login,
      "firstName": this.state.firstName,
      "lastName": this.state.lastName,
      "email": this.state.userEmail,
      "lastModifiedDate": new Date().toISOString(),
      "authorities":  ["ROLE_USER"]
    }

    this.setState({ loader: true });

    ApiService._updateUser.bind(this)(dataObj).then(res => {

      if (res.status == 200) {
        ToastAndroid.show('Successfully updated user!', ToastAndroid.LONG);
        this.props.navigation.goBack();
      }
      else ToastAndroid.show(res.data.toString().length < 100 ? res.data.toString() : 'Something went wrong!', ToastAndroid.LONG);

      this.setState({ loader: false });
    });
  }

  static navigationOptions = (that) => ({
    title: 'Settings',
    headerLeft: <Button style={{ backgroundColor: 'black' }}
      light onPress={() => { that.navigation.goBack() }}>
      <Icon name="ios-arrow-back" style={{ color: '#fff' }} />
    </Button>
  })

  render() {
    return (
      <View>
        <Form>
          <Item>
            <Input placeholder="First Name" onChangeText={(text) => this.setState({ firstName: text })} />
          </Item>
          <Item>
            <Input placeholder="Last Name" onChangeText={(text) => this.setState({ lastName: text })} />
          </Item>

          <Item>
            <Input placeholder="Email" onChangeText={(text) => this.setState({ userEmail: text })} />
          </Item>

          <Button block dark
            disabled={this.disableSubmit()}
            onPress={() => this.updateUser()}
            style={{ alignSelf: 'center', marginTop: 20, width: '90%' }}>
            <Text>Save</Text>
          </Button>
        </Form>

        <Text ></Text>
      </View>
    )
  }
}