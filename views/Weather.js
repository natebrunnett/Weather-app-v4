import * as React from 'react';
import { Text } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, View, ScrollView } from 'react-native'
import { useEffect } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Foundation} from '@expo/vector-icons';

/*
add metric to router instead and pass as prop to weather
rewrite Max on the same line as evening or above Min
*/

const Weather= ({city, country, list}) => {

  useEffect(() => {
    console.log("Weather useEffect")
  }, [])

  const renderIcon = (weather) => {
    switch (weather) {
      case 'Thunderstorm':
        return( <MaterialCommunityIcons 
          name="weather-lightning-rainy" size={20} />)
      case 'Drizzle':
        return( <MaterialCommunityIcons 
          name="weather-partly-rainy" size={20} />)
      case 'Rain':
        return( <MaterialCommunityIcons 
          name="weather-rainy" size={20} />)
      case 'Snow':
        return( <MaterialCommunityIcons 
          name="weather-snowy-heavy" size={20} />)
      case 'Atmosphere':
        return( <MaterialCommunityIcons 
          name="weather-cloudy-alert" size={20} />)
      case 'Clear':
        return( <MaterialCommunityIcons 
          name="weather-sunny" size={20} />)
      case 'Clouds':
        return( <MaterialCommunityIcons 
          name="weather-cloudy" size={20} />)
      default:
        break;
    }
  }

  const renderReport = (data) => {
    
    const dtSunrise = data.sunrise;
    const timeSunrise = new Date(dtSunrise * 1000);
    const dtSunset = data.sunset;
    const timeSunset = new Date(dtSunset * 1000);

    return(
    <View>
      
      <View style={styles.weather}>
      <Text>{data.weather[0].main} {data.weather[0].description} {renderIcon(data.weather[0].main)}</Text>
      </View>

      <Text>
      <MaterialCommunityIcons 
      name="weather-sunset-up" size={20} /> {data.temp.morn}</Text>

      <Text><Foundation 
      name="clock" size={20} />  {data.temp.day}</Text>

      <View style={styles.spaceBetweenRow}>
      <Text>
      <MaterialCommunityIcons 
      name="weather-sunset-down" size={20} /> {data.temp.eve}</Text>
      <Text>Max {data.temp.max}</Text>
      </View>

      <View style={styles.spaceBetweenRow}>
      <Text>
      <MaterialCommunityIcons 
      name="weather-night" size={20} /> {data.temp.night}</Text>
      <Text>Min {data.temp.min}</Text>
      </View>
      <View style={styles.spaceBetweenRow}>
      <Text>
      <MaterialCommunityIcons 
      name="weather-sunset-up" size={20} /> {timeSunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</Text>
      <View style={{flexDirection: "row", alignItems: "center"}}>
        <MaterialCommunityIcons 
        name="weather-sunset-down" size={20} 
        style={{paddingTop: "1%"}}/>
      <Text style={{paddingTop: "1%"}}> {timeSunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
      </Text>
      </View>
      </View>
    
    </View>
    )
  }

  const renderWeekday = (num) => {
    switch (num) {
      case 0:
        return "Sunday";
      case 1:
          return "Monday";   
      case 2:
          return "Tuesday";   
      case 3:
          return "Wednesday";   
      case 4:
          return "Thursday";   
      case 5:
          return "Friday";   
      case 6:
          return "Saturday";            
      default:
        break;
    }
  }

  const renderList = () => (
    list.map((data,idx) =>{
      if(idx > 0){
      const dt = data.dt;
      const dateTitle = new Date(dt * 1000);

      return(
      <View key={idx}>

      <View style={{marginTop: "3%"}}>

      {idx === 1 && <Text style={{ fontSize:16, fontWeight: "bold"}}>Tomorrow</Text>}
      {idx > 1 && <View style= {styles.dateView}><Text style={{ fontSize:15 , fontWeight:"bold"} }>
        {renderWeekday(dateTitle.getDay()) } </Text>
        <Text style={{ fontSize: 11, paddingTop: "1%" }}>{dateTitle.toLocaleDateString()}</Text>
        </View>
      }
      
      </View>
      
      {renderReport(data)}
      

      </View>
      )
      }
    })
  )

    return(
    <SafeAreaProvider style={styles.container}>
    <LinearGradient
        colors={['#ffffff', '#bbe6ff', '#b4e2ff']}
        style={styles.container}>
    <View style={styles.flexSmall}>

    <View style={styles.titleView}>
      
      <Text style={styles.cityText}>{city}</Text>
      <Text style={styles.countryText}>{country}</Text>

    </View>

    {list.length > 0 && renderReport(list[0])}
    
    </View>

    <View style={styles.flexLarge}>
      <ScrollView>
      {renderList()}
      </ScrollView>
    </View>


    </LinearGradient>
    </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({
  flexLarge: {
    flex: 5,
  },
  flexSmall: {
    flex: 2,
    paddingBottom: "7%"
  },
  spaceBetweenRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  cityText: {
    fontSize: 22,
    paddingBottom: "1%"
  },
  container: {
    flex: 1,
    padding: "5%"
  },
  titleView: {
    flexDirection: "row",
    alignItems: "baseline"
  },
  countryText:{
    paddingLeft: "1%",
    fontSize: 10,
    paddingBottom:"1%"
  },
  weather: {
    paddingBottom: "1.25%"
  },
  picker: {
    flex: 1,
    backgroundColor: 'red',
  },
  dateView: {
    flexDirection: "row", 
    alignItems:"center",
  }
});


export default Weather;