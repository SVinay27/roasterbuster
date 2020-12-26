import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';

import { Container, Header, Content, List, ListItem, Text } from 'native-base';
import { FlatList, TouchableOpacity, StyleSheet, View, ScrollView, Alert } from 'react-native';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: [],
    }
  }
  componentDidMount() {

    const apiURL = "https://www.rosterbuster.aero/wp-content/uploads/dummy-response.json"

    fetch(apiURL).then((res) => res.json()).then((resJson) => {

      let newJsonData = Object.values(resJson.reduce((data, item) => {
        if (!data[item.Date]) data[item.Date] = {
          Date: item.Date,
          FlightDetails: []
        };

        data[item.Date].FlightDetails.push(item)
        return data;
      }, {}))

      this.setState({
        data: newJsonData,
      })
    }).catch(error => {
      console.log('error: ', error)
    })
  }

  _getListViewItem = (items) => {
    Alert.alert('Flight Details',

      `Date: ${items.Date}\tFlightnr: ${items.Flightnr}
        Aircraft Type: ${items['Aircraft Type']}\tTail: ${items.Tail}
        Departure: ${items.Departure}\tDestination: ${items.Destination}
        Time Depart: ${items.Time_Depart}\tTime Arrive: ${items.Time_Arrive}
        DutyID: ${items.DutyID}\tDutyCode: ${items.DutyCode}
        Captain: ${items.Captain}\tFirst Officer: ${items['First Officer']}
        Flight Attendant: ${items['Flight Attendant']}`
    );
  }

  _renderItem = ({ item, index }) => {
    return (
      <Content>
        <List>
          <ListItem itemDivider>
            <Text> {item.Date}</Text>
          </ListItem>

          {item.FlightDetails.map((items, index) => (
            <ListItem style={{ justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => this._getListViewItem(items)} style={{ justifyContent: 'space-between', flexDirection: 'row', flex: 1 }}>
                {items.DutyCode === 'FLIGHT' ? <Icon name="plane" size={30} color="#900" /> :

                  items.DutyCode === 'Standby' ? <Icon name="clipboard" size={30} color="#900" /> :

                    items.DutyCode === 'LAYOVER' ? <Icon name="briefcase" size={30} color="#900" /> :

                      items.DutyCode === 'OFF' ? <Icon name="plane" size={30} color="#900" /> : <SimpleIcon name="plane" size={30} color="#900" />}

                <Text style={{ fontSize: 18 }}>{
                  items.Departure === items.Destination ? items.DutyCode : items.Departure + ' - ' + items.Destination
                }</Text>

                <Text style={{ fontSize: 18, color: '#CC2400' }}>{items.Time_Depart.length === 8 ?
                  items.Time_Depart.slice(0, -3) + ' - ' + items.Time_Arrive.slice(0, -3) : items.Time_Depart + ' - ' + items.Time_Arrive}</Text>
              </TouchableOpacity>
            </ListItem>
          ))}
        </List>
      </Content>
    )

  }

  render() {
    return (
      <Container>
        <Content>
          <ScrollView>
            <List>
              <FlatList
                data={this.state.data}
                renderItem={this._renderItem}
                keyExtractor={(index, item) => item.Date}

              />
            </List>
          </ScrollView>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
})


export default App;