import { StyleSheet, Text, View, Image } from 'react-native';
import MapView, { Heatmap } from 'react-native-maps';
import axios from "axios";
import { useState } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function App() {

  const [heatmaps, setHeatmaps] = useState([]);
  const [mapIntialLocation, setMapIntialLocation] = useState({
    lat: 56.6979538,
    lng: -2.9124057
  });

  const getCityCrimesCount = (city, coordinates) => {
    const locationCrimeMap = {};
    var totalCrimes = 0;
    const uri = "https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fall-crimes&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC";
    axios.get(uri)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (data) {
        data.data.rows.forEach(records => {
          locationCrimeMap[records.metadata.resource.value.toLowerCase().replaceAll(" ", "_")] = records.content[25].value;
          totalCrimes += parseInt(records.content[25].value.replaceAll(",", ""));
        });
        const crimeCount = locationCrimeMap[Object.keys(locationCrimeMap).filter((value, index) => {
          if (value.includes(city.split(" ")[0].toLowerCase()))
            return value
        })[0]];
        if (crimeCount) {
          setHeatmaps([
            {
              latitude: coordinates.lat,
              longitude: coordinates.lng,
              weight: parseInt(crimeCount.replaceAll(",", "")),
              totalCount: totalCrimes,
              city: city
            }
          ])
        }
      });
  }

  return (
    <View style={styles.container}>
      <MapView
        region={{
          latitude: mapIntialLocation.lat,
          longitude: mapIntialLocation.lng,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        initialRegion={{
          latitude: mapIntialLocation.lat,
          longitude: mapIntialLocation.lng,
          latitudeDelta: 1,
          longitudeDelta: 1,
        }}
        style={styles.map}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        {heatmaps.length > 0 && <Heatmap
          points={
            heatmaps
          }
        >
        </Heatmap>}
      </MapView>
      <View
        style={[styles.mapBottomContainer]}
      ><GooglePlacesAutocomplete
          placeholder='Search in Maps'

          onPress={async (data, details = null) => {
            // 'details' is provided when fetchDetails = true
            getCityCrimesCount(details.address_components[0].short_name, details.geometry.location);
            setMapIntialLocation(details.geometry.location)
          }}
          fetchDetails={true}
          query={{
            key: 'AIzaSyDXUi5en6uoWnnNmuG1ttoMCRIJfghjzxw',
            language: 'en',
            components: 'country:uk',
          }}
          styles={{
            container: {
              backgroundColor: "#292929",
              marginVertical: 20,
              marginHorizontal: 20,
              position: 'absolute',
              width: 380
            },
            textInputContainer: {
              borderRadius: 20,
            },
            textInput: {
              position: "relative",
              height: 48,
              color: 'white',
              backgroundColor: "#858585",
              fontSize: 16,
              borderRadius: 20
            },
            predefinedPlacesDescription: {
              color: 'red',
            },

          }}
        />
        {heatmaps[0] &&
          <View style={[styles.contentActiveDescription]}>
            <Text style={{ color: "white", fontSize: 20, }}>
              Crimes in {heatmaps[0]?.city} - {heatmaps[0]?.weight}
            </Text>
            <Text style={{ color: "white", marginTop: 10, fontSize: 20, }}>
              Total Crimes in Scotland - {heatmaps[0]?.totalCount}
            </Text><Text style={{ color: "white", marginTop: 10, fontSize: 12, }}>
              * above data is referencing to crimes happend in 2021 - 2022
            </Text>
          </View>
        }

        {heatmaps[0] &&
          <View style={{
            backgroundColor: "#858585",
            height: 100
          }}><Text
            style={{
              color: "white",
              marginLeft: 30,
              marginTop: 10,
              height: 20
            }}
          >
              Favourites
            </Text>
            <View style={{
              backgroundColor: "white",
              borderRadius: 50,
              width: 50,
              height: 50,
              marginTop: 10,
              marginLeft: 30
            }}>
              <Image
                style={{
                  width: 50,
                  height: 50,

                }}
                source={{
                  uri: 'https://static.vecteezy.com/system/resources/previews/010/157/483/original/house-symbol-and-home-icon-sign-design-free-png.png'
                }} />
            </View>
          </View>}
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292929',
  },
  map: {
    width: '100%',
    height: '50%',
  },
  mapBottomContainer: {
    backgroundColor: "#292929",
    width: "100%",
    height: "50%",
    marginVertical: -10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: 'column',
  },
  contentActiveDescription: {
    marginVertical: 100,
    marginLeft: 30,
    color: "white"
  }
});
