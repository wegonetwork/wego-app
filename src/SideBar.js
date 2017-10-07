import React, { Component } from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import { Container, Content, List, ListItem, Text, Thumbnail } from 'native-base';

const Sidebar = (props) => {
    return (
        <Container style={styles.container}>
            <View>
                <List style={{ padding: 0, margin: 0 }}>

                    <ListItem style={styles.menuHeader}>
                        <View style={styles.thumbnailContainer}>
                            <View>
                                <Thumbnail source={require('../images/man.jpg')} />
                            </View>
                            <View style={{ alignSelf: 'center' }}>
                                <Text style={styles.FontTitle}>{props.user.firstName}</Text>
                                <Text style={styles.ratingContainer}>
                                    <Text style={styles.rating}>4.76</Text>
                                    <Image style={{ height: 40, width: 40, paddingLeft: 50 }}
                                        source={require('../images/rating_star.png')} />
                                </Text>
                            </View>
                        </View>
                    </ListItem>

                    <ListItem onPress={() => {
                        props.onClose()
                        props.navigate('Trips')
                    }}
                        style={styles.listItem}>
                        <Text>Your Trips</Text>
                    </ListItem>
                    <ListItem onPress={() => {
                        props.onClose();
                        props.navigate('Settings')
                        }}
                        style={[props.demoUser? styles.hide : styles.show, styles.listItem]}>
                        <Text>Settings</Text>
                    </ListItem>
                    <ListItem onPress={() => {
                        props.onClose();
                        props.gotoLogin();
                        }}
                        style={[props.demoUser? styles.show : styles.hide, styles.listItem]}>
                        <Text>Sign up</Text>
                    </ListItem>
                </List>

            </View>

            <View style={props.demoUser? styles.hide : styles.show}>
                <List>
                    <ListItem onPress={() => {
                        props.onClose();
                        props.navigate('Driversignup')
                    }}
                        style={styles.listItem}>
                        <Text>Driver sign up</Text>
                    </ListItem>
                    <ListItem onPress={() => {
                        props.onClose();
                        props.navigate('Terms')
                    }}
                        style={styles.listItem}>
                        <Text>Term of Service</Text>
                    </ListItem>
                </List>
            </View>
        </Container>
    );
};

export default Sidebar;

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        left: -17,
        flexDirection: 'column',
        backgroundColor: '#fff',
        justifyContent: 'space-between',
        height: Dimensions.get("window").height
    },
    menuHeader: {
        backgroundColor: 'black',
        height: 110,
        paddingLeft: 25,
        paddingTop: 20
    },
    listItem: {
        padding: 10
    },
    thumbnailContainer: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: 'space-around',
    },
    FontTitle: {
        color: 'white',
        fontSize: 17,
        paddingLeft: 8
    },
    ratingContainer: {
        paddingLeft: 14,
    },
    rating: {
        color: '#a4a4ac',
        fontSize: 12,
        paddingLeft: 34,
    },
    hide:{
        display: 'none'
    },
    show: {
        display: 'flex'
    }
})


