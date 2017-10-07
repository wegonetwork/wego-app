import React from 'react'
import { Container, Text, Button, Icon } from 'native-base'
import { TabNavigator } from 'react-navigation'

class TripsPast extends React.Component {
  constructor(props) {
    super(props)
  }
  static navigationOptions = {
    title: 'Past'
  }

  render() {
    return (
      <Container>
        <Text>Past</Text>
      </Container>
    )
  }
}
class TripsUpcoming extends React.Component {
  constructor(props) {
    super(props)
  }
  static navigationOptions = {
    title: 'Upcoming'
  }

  render() {
    return (
      <Container>
        <Text>Upcoming</Text>
      </Container>
    )
  }
}
export class Trips extends React.Component {
  static navigationOptions = (that) => ({
    title: 'Trips',
    headerLeft: <Button style={{ backgroundColor: 'black' }} light onPress={() => { that.navigation.goBack() }}><Icon name="ios-arrow-back" style={{ color: '#fff' }} /></Button>
  })
  render() {
    return (
      <Navigator />
    )
  }
}
const Navigator = TabNavigator({
  Home: {
    screen: TripsPast,
  },
  Upcoming: {
    screen: TripsUpcoming,
  },
}, {
    tabBarPosition: 'top',
    tabBarOptions: {
      animationEnabled: true,
      activeTintColor: '#e91e63',
      style: { backgroundColor: '#000' },
      labelStyle: { color: '#fff' },
      tabStyle: { backgroundColor: '#000', borderBottomColor: '#2775A4', borderBottomWidth: 3 }
    },
  });
