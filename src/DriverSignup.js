import React, { PureComponent } from 'react';
import { View, ToastAndroid, Picker } from 'react-native';
import { Container, Header, Content, Input, Text, Button, Icon, Form, Item } from 'native-base';
import { ApiService } from './services/apis';

export default class Driversignup extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            userCountry: 'United States',
            loading: false,
            userEmail: '',
            userphone: '',
            firstName: '',
            lastName: '',
            countryList: ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia",
                "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan",
                "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon",
                "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo Democratic Rep",
                "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor",
                "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon",
                "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
                "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica",
                "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos",
                "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi",
                "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
                "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand",
                "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
                "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia",
                "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
                "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka",
                "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga",
                "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
                "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"]
        }
    }

    static navigationOptions = (that) => ({
        title: 'Driver Registrtation',
        headerLeft: <Button style={{ backgroundColor: 'black' }}
            light onPress={() => { that.navigation.goBack() }}>
            <Icon name="ios-arrow-back" style={{ color: '#fff' }} />
        </Button>
    })

    disableSubmit = () => {
        if (this.state.userEmail.trim() == "" || (this.state.userEmail.trim() != "" && !ApiService.validateEmail.bind(this)(this.state.userEmail)) ||
            this.state.userCountry.trim() == "" || this.state.userphone.trim() == "" ||
            this.state.lastName.trim() == "" || this.state.firstName.trim() == "" || this.state.loading) {
            return true;
        }
        return false;
    }
    registerDriver = () => {

        if (!this.disableSubmit) {
            ToastAndroid.show('Please fill all fields !', ToastAndroid.SHORT);
            return false;
        }

        let dataObj = {
            fullName: this.state.firstName + " " + this.state.lastName,
            user: {
                "login": this.state.userEmail,
                "firstName": this.state.firstName,
                "lastName": this.state.lastName,
                "email": this.state.userEmail,
                "imageUrl": null,
                "activated": true,
                "langKey": "en",
                "createdBy": "admin",
                "createdDate": new Date().toISOString(),
                "lastModifiedBy": "admin",
                "lastModifiedDate": new Date().toISOString(),
                "authorities": [
                    "ROLE_USER"
                ]
            },
        }
        this.setState({ loading: true })
        ApiService._registerDriver.bind(this)(dataObj).then(res => {
            console.log(res)
            if (res.status == 201) {
                ToastAndroid.show('Driver successfully created !', ToastAndroid.LONG);
                this.props.navigation.goBack();
            }
            else ToastAndroid.show(res.data.toString().length < 100 ? res.data.toString() : 'Something went wrong!', ToastAndroid.LONG);
            this.setState({ loading: false });
        });
    }

    onCountryChange = (val) => {
        console.log(val)
    }

    render() {

        let countryPickerItems = this.state.countryList.map((s, i) => {
            return <Picker.Item key={i} value={s} label={s} />
        });

        return (
            <View>
                <Picker
                    selectedValue={this.state.userCountry}
                    onValueChange={(country) => (this.setState({ userCountry: country }))}>
                    {countryPickerItems}
                </Picker>

                <Item><Text></Text></Item>

                <Item>
                    <Input placeholder="First Name" onChangeText={(text) => this.setState({ firstName: text })} />
                </Item>
                <Item>
                    <Input placeholder="Last Name" onChangeText={(text) => this.setState({ lastName: text })} />
                </Item>

                <Item>
                    <Input placeholder="Email" onChangeText={(text) => this.setState({ userEmail: text })} />
                </Item>

                <Item>
                    <Input placeholder="Phone Number" onChangeText={(text) => this.setState({ userphone: text })} />
                </Item>

                <Button block dark
                    style={{ alignSelf: 'center', marginTop: 20, width: '90%' }}
                    onPress={this.registerDriver}
                    disabled={this.disableSubmit()}
                >
                    <Text>Submit</Text>
                </Button>

                <Text></Text>
            </View>
        )
    }
}