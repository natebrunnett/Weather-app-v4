import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Weather from '../views/Weather';
import Search from '../views/Search';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import axios from "axios"
import * as Location from 'expo-location';
import {API_KEY} from "@env"


export default function Router() {

  const [longitude, setLongitude] = useState(null)
  const [latitude, setLatitude] = useState(null)
  const [count, setCount] = useState('16');
  const [metric, setMetric] = useState('imperial');

  //stored fetched data
  const [city, setCity] = useState('No location')
  const [country, setCountry] = useState('')
  const [list, setList] = useState([]);


  const makeApiCall = async (title) => {
    const addToList = (thisList) =>{
      const temp = []
      for(let i = 0; i < thisList.length; i++){
        temp.push(thisList[i])
      }
      setList(temp); //works but is delayed in consolelog
    }
  
    let apiCall;
     if(title !== undefined){
       apiCall = `https://api.openweathermap.org/data/2.5/forecast/daily?q=${title}&cnt=${count}&units=${metric}&appid=${API_KEY}`;
    }else{
    apiCall = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=${count}&units=${metric}&appid=${API_KEY}`;
    }
    try{
      const response = await axios.get(apiCall)
      setCity(response.data.city.name)
      setCountry(response.data.city.country)
      addToList(response.data.list)
      console.log(response.data)
    }catch(e){console.log(e)}
    console.log("apiCalled")
  }

  const Stack = createBottomTabNavigator();

  useEffect(() => {
    //original: all data is fetched here
    console.log("Router useEffect")
    const getGeolocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setLatitude(location.coords.latitude);
        setLongitude(location.coords.longitude);
      } catch (error) {
        console.error('Error getting location:', error);
      }
    }
    if(!longitude)
    {
      console.log("Geolocation called")
      getGeolocation();
    }
    if(longitude)
    {
      makeApiCall();
    }
  }, [longitude])



  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Weather"
          options={{
            tabBarLabel: 'Weather',
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <MaterialCommunityIcons name="weather-sunny" size={25} />
              ) : (
                <MaterialCommunityIcons name="weather-sunny" size={20} />
              )
          }}
        >
        {props => <Weather {...props} 
        city={city}
        country={country} 
        list={list}
        />}
        </Stack.Screen>
        <Stack.Screen
          name="Search"
          options={{
            headerTitleStyle: {fontSize: 22},
            tabBarLabel: 'Search',
            tabBarIcon: ({ focused, color, size }) =>
              focused ? (
                <Ionicons name="search-sharp" size={25} />
              ) : (
                <Ionicons name="search" size={20} />
              )
          }}
        >
        {props => <Search {...props} 
        makeApiCall={makeApiCall}
        setMetric={setMetric}
        metric={metric}
        />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

//da