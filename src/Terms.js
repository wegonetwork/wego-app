import React, { PureComponent } from 'react';
import { View, ToastAndroid } from 'react-native';
import { Button, Icon, Text } from 'native-base';
import { ApiService } from './services/apis';

export default class Terms extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            termsInfo: ""
        };
    }

    static navigationOptions = (that) => ({
        title: 'Terms of Services',
        headerLeft: <Button style={{ backgroundColor: 'black' }}
            light onPress={() => { that.navigation.goBack() }}>
            <Icon name="ios-arrow-back" style={{ color: '#fff' }} />
        </Button>
    })

    componentDidMount(){
        ApiService._getTerms.bind(this)().then(res => {
            if (res.status == 200) {
                console.log(res.data[0])
                this.setState({termsInfo: res.data[0].terms})
            }
            else ToastAndroid.show('Unable to get terms!', ToastAndroid.LONG);
        });
    }
    render() {
        return (
            <View>
                <Text>{this.state.termsInfo}</Text>
            </View>
        )
    }
}