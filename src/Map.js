import React, { PureComponent } from 'react'
import { View, Text, ActivityIndicator, TextInput, FlatList, StyleSheet, Image } from 'react-native'
import MapView from 'react-native-maps';
import axios from 'axios'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import polyline from '@mapbox/polyline';
import ApiService from './services/apis';

const GOOGLE_API_KEY = 'AIzaSyAoWNKA9L0ugiSvWiTzp1xhza2yfWeTbfg'

//state updates
const updateCurrentPosition = (currentPosition) => (state) => {
    return { currentPosition, loading: false }
}

//google place autocompletes styles
const autoStyle = {
    textInputContainer: {
        backgroundColor: 'rgba(255,255,255,1)',
        borderTopWidth: 0,

    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        color: '#5d5d5d',
        fontSize: 16
    },
    predefinedPlacesDescription: {
        color: '#1faadb'
    },
    listView: {
        backgroundColor: "#fff",
        flexWrap: 'wrap'
    }
}


export default class Map extends PureComponent {

    constructor(props) {
        super(props)
        this.state = {
            currentPosition: {
                latitude: '',
                longitude: "",
            },
            loading: true,
            query: '',
            places: [],
            destination: false,
            steps: [],
            address: '',
            nearByCars: [],
            noCarAvailable : false
        }
        this._searchPlaces = this._searchPlaces.bind(this)
        this._selectDestination = this._selectDestination.bind(this)
        this._fetchNearByCars = this._fetchNearByCars.bind(this)
        this.timer = ''
    }

    componentDidMount() {
        navigator.geolocation.getCurrentPosition((location) => {
            let { longitude, latitude } = location.coords

            this.setState(updateCurrentPosition({ longitude, latitude }))
            this._fetchNearByCars()
        })


    }
    
    async _fetchNearByCars() {
        let response = await axios.get(ApiService.hostName+`/v1/drivers/nearby.php?a=${this.state.currentPosition.latitude}&l=${this.state.currentPosition.longitude}`)
        let nearByCars = response.data;
        if(nearByCars && !nearByCars.length){
            this.setState({ noCarAvailable : true });
            return false;
        }
        this.setState({ noCarAvailable : false });
        nearByCars = nearByCars.map((car) => {
            return { latitude: car[3], longitude: car[2] }
        })
        this.setState({
            nearByCars
        })
    }

    async _searchPlaces() {
        try {
            let response = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${this.state.query}&key=${GOOGLE_API_KEY}`)

            this.setState({
                places: response.data.results
            })
        }
        catch (error) {

        }

    }

    _renderItem({ item }) {
        return (
            <View style={{ padding: 10, justifyContent: 'flex-start', flexDirection: 'row', flexWrap: 'wrap' }}>
                <Image source={require('../images/location.png')} style={[styles.marker]} />
                <Text>{item.formatted_address}</Text>
            </View>
        )

    }

    async _selectDestination(data, details = null) {
        let { lat, lng } = details.geometry.location
        let destination = {
            latitude: lat,
            longitude: lng
        }
        this.setState({
            destination
        })

        let response = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.currentPosition.latitude},${this.state.currentPosition.longitude}&destination=${this.state.destination.latitude},${this.state.destination.longitude}&key=${GOOGLE_API_KEY}`)
        let directionArray = polyline.decode(response.data.routes[0].overview_polyline.points)
        directionArray = directionArray.map((point, index) => {
            return {
                latitude: point[0],
                longitude: point[1]
            }
        })
        this.setState({ steps: directionArray })


    }

    _keyExtractor = (item, index) => item.id;

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1 }}>
                    <ActivityIndicator animating={true} size="large" />
                </View>
            )
        }
        let { latitude, longitude } = this.state.currentPosition
        return (
            <View style={{ flex: 1 }}>

                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        latitudeDelta: 0.2,
                        longitudeDelta: 0.2,
                    }}
                >
                    <MapView.Marker
                        coordinate={{ latitude: parseFloat(latitude), longitude: parseFloat(longitude) }}
                    />
                    {this.state.nearByCars.map((car, index) => {
                        return <MapView.Marker
                            key={index}
                            coordinate={car}
                        >
                            <Image
                                source={require('../images/car.png')}
                                style={{ width: 30, height: 30 }}
                            />
                        </MapView.Marker>
                    })}
                    {
                        this.state.destination ? <MapView.Marker
                            coordinate={{ latitude: parseFloat(this.state.destination.latitude), longitude: parseFloat(this.state.destination.longitude) }}
                        /> :
                            null
                    }
                    {
                        this.state.steps && this.state.steps.length > 0 ?
                            <MapView.Polyline
                                coordinates={this.state.steps}
                                strokeWidth={4}
                            />
                            :
                            null
                    }
                </MapView>
                <View style={{ padding: 20, position: 'absolute', top: 20, left: 0, right: 0 }}>
                    <GooglePlacesAutocomplete
                        placeholder='Where to go?'
                        minLength={2}
                        autoFocus={false}
                        returnKeyType={'default'}
                        fetchDetails={true}
                        query={{ key: GOOGLE_API_KEY }}
                        styles={autoStyle}
                        currentLocation={false}
                        onPress={this._selectDestination}

                    />
                </View>

                 <View style={{ padding: 10, 
                                position: 'absolute', 
                                top: 0, left: 0, right: 0, 
                                backgroundColor: '#f1f105',
                                display: (this.state.noCarAvailable? 'flex': 'none') 
                                }}>
                        <Text style={{color: '#ffffff'}}>Sorry! No car is available at this moment </Text>
                </View> 

            </View>
        )
    }
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: "#fff",
        marginTop: 5
    },
    seperator: {
        height: 1, borderBottomWidth: 1, borderColor: "#ccc",
    },
    closeButton: {
        width: 20, height: 20, position: 'absolute', top: 20, right: 0, zIndex: 10000
    },
    searchInput: {
        backgroundColor: "#fff", padding: 10, fontSize: 20
    },
    marker: {
        height: 10,
        width: 10
    }
})