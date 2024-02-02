import * as React from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, TextInput, Pressable, Button, Alert, Keyboard, FlatList, TouchableHighlight } from 'react-native'
import { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import uuid from 'react-native-uuid';
import {GOOGLE_API} from "@env"

const Search = ({ makeApiCall, setMetric, metric}) => {

  const [ list, setList ] = useState([]);
  const [ cityInput, setCityInput ] = useState('');

  useEffect(() => {
    console.log("Search useEffect")
  }, []);

  const handleSubmit = (title) => {
    Alert.alert('Weather', 'Updated', [
      {text: 'OK'},
    ]);
    // console.log('title ' + title)
    setTimeout(() => {
      makeApiCall(title);
    }, 2000)
    setCityInput('');
    setList('');
    Keyboard.dismiss();
  }

  const apiCall = async () =>{
    const apiCall = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${cityInput}&types=geocode&key=${GOOGLE_API}`
    try {
      const response = await axios.get(apiCall)
      // console.log(response.data.predictions)
      let newData = [];
      for (let e = 0; e < response.data.predictions.length; e++)
      {
        const newTitle = {
          id: uuid.v4(),
          title: response.data.predictions[e].description
        }
        newData.push(newTitle)
      }
      setList(newData);
      console.log(list);
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (text) => {
    setCityInput(text);
    apiCall();
  }

  function Item({ title,id }) {
    return (
      <TouchableHighlight
      onPress={() => handleSubmit(title)}
      underlayColor={'#AAA'}
      >
        <View style={styles.listRow}>
        <Text style={styles.listItem}>{title}</Text>
        <AntDesign name="arrowright" size={24} color="black" />
        </View>
      </TouchableHighlight>
    );
  }


    return(
    <SafeAreaProvider style={styles.container}>
    <LinearGradient
        colors={['#ffffff', '#bbe6ff', '#b4e2ff']}
        style={styles.container}>
      <View style={styles.main}>

        <View>

          <View style={styles.searchContainer}>
            
            <AntDesign name="bars" size={30} color="black" />

            <TextInput
              style={styles.textInput}
              value={cityInput}
              placeholder='city'
              onChangeText={(text) => handleInputChange(text)}
            />

            <FontAwesome name="search" size={26} color="black" />


          </View>

          <View style={styles.picker}>
            <Text style={{fontSize: 14, fontWeight:'bold'}}>Metric </Text>
            <Picker
              itemStyle={styles.itemStyle}
              selectedValue={metric}
              onValueChange={ (itemValue, itemIndex) => setMetric(itemValue) }>
              <Picker.Item label="Celsius" value="metric" />
              <Picker.Item label="Fahrenheit" value="imperial" />
          </Picker>

          <Pressable
          onPress={() => handleSubmit(cityInput)}
          style={styles.submit}
          >
            <Text style={styles.submitText}>Submit</Text>
          </Pressable>

          </View>
          
        <View style={styles.flatList}>
          <FlatList
            data={list}
            renderItem={({ item }) => <Item title={item.title} id={item.id} />}
            keyExtractor={item => item.id}
          />
        </View>
      </View>

      <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>

        
        {/* <Button onPress={apiCall} title="apiCall"></Button>

        <Button title="list"onPress={() => { console.log(list)}}></Button> */}

      </View>
      </View>
    </LinearGradient>
    </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
  // city: {
  //   fontWeight: 'bold', 
  //   fontSize: 22,
  //   paddingBottom: '2%',
  //   paddingRight: '1%'
  // },
  container: {
    flex: 1,
    padding: "5%",
  },
  main: {
    flex: 7,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems:'center',
    margin: "2%",
  },
  textInput: {
    height: 40, 
    borderColor: 'black', 
    width:"80%",
    borderWidth: 1,
    justifyContent: 'center',
    borderRadius: 10
  },
  picker: {
    paddingTop: "0%",
    marginTop: "2%",
    paddingBottom: 0,
    marginBottom: "1.5%",
    marginLeft: "4%",
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemStyle: {
    color:'black',
    width:130, 
    height:40,
    fontSize: 14,
  },
  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: "100%",
    gap: 10
  },
  submit:{
    backgroundColor: '#0089FF',
    borderRadius: 10
  },
  submitText: {
    color: 'white',
    padding: 9,
  },

  //FlatList start
  flatList: {
    borderTopWidth: 1,
    width: "105%",
  },
  listItem: {
    fontSize: 22,
    textAlign: 'left',
    width: "100%"
  },
  listRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 25,
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5
  }

  //FlatList end


});



export default Search;