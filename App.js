import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Heatmap, Marker } from "react-native-maps";
import axios from "axios";
import { useState, useEffect } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FeatherIcon from "react-native-vector-icons/Feather";
import { KeyboardAvoidingView } from "react-native";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";

export default function App({ navigation }) {
  const [heatmaps, setHeatmaps] = useState([]);
  const [location, setLocation] = useState("");
  const [mapInitialLocation, setMapInitialLocation] = useState({
    lat: 56.6979538,
    lng: -2.9124057,
  });
  const [markerLocation, setMarkerLocation] = useState({});

  async function getUserLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      setLoading(false);
      return;
    }

    Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000 },
      (location) => {
        setLocation(location);
        setMapInitialLocation({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });
        setMarkerLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    );

    return () => {
      location.remove();
    };
  }
  useEffect(() => {
    // getUserLocation();
  }, []);
  const myMapCustomStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#8ec3b9",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1a3646",
        },
      ],
    },
    {
      featureType: "administrative.country",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#64779e",
        },
      ],
    },
    {
      featureType: "administrative.province",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#4b6878",
        },
      ],
    },
    {
      featureType: "landscape.man_made",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#334e87",
        },
      ],
    },
    {
      featureType: "landscape.natural",
      elementType: "geometry",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#283d6a",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#6f9ba5",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "poi.government",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#3C7680",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#304a7d",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#2c6675",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [
        {
          color: "#255763",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#b0d5ce",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#023e58",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#98a5be",
        },
      ],
    },
    {
      featureType: "transit",
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#1d2c4d",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry.fill",
      stylers: [
        {
          color: "#283d6a",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#3a4762",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#0e1626",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#4e6d70",
        },
      ],
    },
  ];
  const getCityCrimesCount = (city, coordinates) => {
    const locationCrimeMap = {};
    var totalCrimes = 0;
    const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fall-crimes&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
    axios
      .get(uri)
      .then(function (response) {
        return response;
      })
      .catch(function (error) {
        console.log(error);
      })
      .then(function (data) {
        const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fcrimes-group-1-robbery&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
        axios
          .get(uri)
          .then(function (response) {
            return response;
          })
          .catch(function (error) {
            console.log(error);
          })
          .then(function (firstCrimeData) {
            const uri = `https://statistics.gov.scot/slice/observations.json?&dataset=http%3A%2F%2Fstatistics.gov.scot%2Fdata%2Frecorded-crime&http%3A%2F%2Fpurl.org%2Flinked-data%2Fcube%23measureType=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fmeasure-properties%2Fcount&http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fdimension%2FcrimeOrOffence=http%3A%2F%2Fstatistics.gov.scot%2Fdef%2Fconcept%2Fcrime-or-offence%2Fall-group-3-crimes-of-dishonesty&http%3A%2F%2Fpurl.org%2Flinked-data%2Fsdmx%2F2009%2Fdimension%23refArea=%7B%22related%22%3A%7B%22http%3A%2F%2Fpublishmydata.com%2Fdef%2Fontology%2Fspatial%2FmemberOf%22%3A%22*%22%7D%7D&page=1&perPage=200&sortDirection=ASC`;
            axios
              .get(uri)
              .then(function (response) {
                return response;
              })
              .catch(function (error) {
                console.log(error);
              })
              .then(function (secondCrimeData) {
                data.data.rows.forEach((records) => {
                  locationCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                  totalCrimes += parseInt(
                    records.content[25].value.replaceAll(",", "")
                  );
                });
                const crimeCount =
                  locationCrimeMap[
                    Object.keys(locationCrimeMap).filter((value, index) => {
                      if (value.includes(city.split(" ")[0].toLowerCase()))
                        return value;
                    })[0]
                  ];

                // Getting first type of crime reports count
                const locationFirstCrimeMap = {};
                firstCrimeData.data.rows.forEach((records) => {
                  locationFirstCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                });
                const firstCrimeCount =
                  locationFirstCrimeMap[
                    Object.keys(locationFirstCrimeMap).filter(
                      (value, index) => {
                        if (value.includes(city.split(" ")[0].toLowerCase()))
                          return value;
                      }
                    )[0]
                  ];

                // Getting second type of crime reports count
                const locationSecondCrimeMap = {};
                secondCrimeData.data.rows.forEach((records) => {
                  locationSecondCrimeMap[
                    records.metadata.resource.value
                      .toLowerCase()
                      .replaceAll(" ", "_")
                  ] = records.content[25].value;
                });
                const secondCrimeCount =
                  locationSecondCrimeMap[
                    Object.keys(locationSecondCrimeMap).filter(
                      (value, index) => {
                        if (value.includes(city.split(" ")[0].toLowerCase()))
                          return value;
                      }
                    )[0]
                  ];

                // Setting the heatmap data

                if (crimeCount) {
                  const weight =
                    parseInt(crimeCount.replaceAll(",", "")) + 1000;
                  const totalCount = totalCrimes;
                  const robbery = parseInt(firstCrimeCount.replaceAll(",", ""));
                  const dishonesty = parseInt(
                    secondCrimeCount.replaceAll(",", "")
                  );

                  if (weight >= 40000 && totalCount >= 40000 && robbery > 300) {
                    alertLevel = "High";
                  } else if (weight >= 20000 && totalCount >= 20000) {
                    alertLevel = "Medium";
                  } else {
                    alertLevel = "Low";
                  }
                  setHeatmaps([
                    {
                      alertLevel,
                      latitude: coordinates.lat,
                      longitude: coordinates.lng,
                      weight,
                      totalCount,
                      city,
                      robbery,
                      dishonesty,
                    },
                  ]);
                }
              });
          });
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <StatusBar style="light" />
      <View style={styles.container}>
        <MapView
          customMapStyle={myMapCustomStyle}
          region={{
            latitude: mapInitialLocation.lat,
            longitude: mapInitialLocation.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          initialRegion={{
            latitude: mapInitialLocation.lat,
            longitude: mapInitialLocation.lng,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          provider={"google"}
          style={styles.map}
          zoomEnabled={true}
          zoomControlEnabled={true}
        >
          {heatmaps.length > 0 && (
            <Heatmap radius={50} opacity={1.0} points={heatmaps}></Heatmap>
          )}
          {markerLocation.latitude && (
            <Marker
              coordinate={markerLocation}
              title="Your Location"
              description="This is your current location"
            />
          )}
        </MapView>

        <View style={[styles.mapBottomContainer]}>
          <TouchableOpacity
            style={{
              position: "absolute",
              top: -70,
              right: 30,
            }}
            onPress={() => {
              getUserLocation();
            }}
          >
            <FeatherIcon color="white" name="map" size={35} />
          </TouchableOpacity>
          <GooglePlacesAutocomplete
            placeholder="Search Maps"
            debounce={400}
            onPress={async (data, details = null) => {
              getCityCrimesCount(
                details.address_components[0].short_name,
                details.geometry.location
              );
              setMapInitialLocation(details.geometry.location);
            }}
            fetchDetails={true}
            query={{
              key: "AIzaSyDXUi5en6uoWnnNmuG1ttoMCRIJfghjzxw",
            }}
            styles={{
              container: {
                marginVertical: 20,
                marginHorizontal: 0,
                position: "absolute",
                width: 300,
                zIndex: 10,
                shadowColor: "#7727c2",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 10,
                shadowRadius: 15,
                borderRadius: 25,
              },
              poweredContainer: {
                display: "none",
              },
              textInputContainer: { borderRadius: 20 },
              textInput: {
                position: "relative",
                height: 48,
                backgroundColor: "#adacb5",
                fontSize: 16,
                borderRadius: 20,
              },
              row: {
                backgroundColor: "#adacb5",
              },
              predefinedPlacesDescription: { color: "red" },
            }}
          />
          <View
            style={{
              position: "absolute",
              right: 25,
              top: 23,
              color: "white",
              zIndex: 10,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 20,
              shadowRadius: 5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Setting");
              }}
            >
              <FeatherIcon color="black" name="user" size={45} />
            </TouchableOpacity>
          </View>

          {!heatmaps[0] && (
            <Text
              style={{
                marginTop: 140,
                fontSize: 22,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Enter the area you want crime data for (Scotland Only)
              <Text
                style={{
                  marginTop: 50,
                  fontSize: 18,
                  fontWeight: "normal",
                  color: "black",
                }}
              >
                *Data is referencing to crimes happened in 2021 - 2022.
              </Text>
            </Text>
          )}

          {heatmaps[0] && (
            <View>
              <View style={[styles.frequencyBox]}>
                <Text
                  style={{
                    color:
                      heatmaps[0]?.alertLevel === "High"
                        ? "red"
                        : heatmaps[0]?.alertLevel === "Medium"
                        ? "yellow"
                        : "green",
                    marginLeft: 10,
                    marginTop: 10,
                    height: 20,
                    fontWeight: "700",
                    fontSize: 20,
                  }}
                >
                  {heatmaps[0]?.alertLevel === "High"
                    ? "Alert Level - High"
                    : heatmaps[0]?.alertLevel === "Medium"
                    ? "Alert Level - Medium"
                    : "Alert Level - Low"}
                </Text>

                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    marginTop: 10,
                    height: 20,
                    fontWeight: "normal",
                    fontSize: 10,
                  }}
                >
                  Alert level is calculated using total crime report in your
                  area and Scotland.{" "}
                </Text>
              </View>
              <View style={[styles.crimeDetailsBox]}>
                <Text style={[styles.contentHeader]}>Crime Types</Text>
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    marginTop: 10,
                    height: 20,
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Robbery - {heatmaps[0]?.robbery}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    marginTop: 10,
                    height: 20,
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Dishonesty Crimes - {heatmaps[0]?.dishonesty}
                </Text>
                <Text
                  style={{
                    color: "gray",
                    marginLeft: 10,
                    marginTop: 10,
                    height: 20,
                    marginBottom: 20,
                    fontWeight: "bold",
                    fontSize: 15,
                  }}
                >
                  Total Crime Reports - {heatmaps[0]?.weight}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  map: {
    width: "100%",
    height: "60%",
  },
  mapBottomContainer: {
    backgroundColor: "#6d6987", //#6d6987
    width: "100%",
    height: "40%",
    marginVertical: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexDirection: "column",
  },
  contentActiveDescription: {
    marginVertical: 100,
    marginLeft: 30,
    color: "white",
  },
  frequencyBox: {
    marginTop: 90,
    marginLeft: 0,
    color: "white",
    width: "100%",
    backgroundColor: "black",
    borderRadius: 10,
    zIndex: 1,
  },
  crimeDetailsBox: {
    marginTop: 12,
    marginLeft: 0,
    color: "white",
    width: "100%",
    backgroundColor: "black",
    borderRadius: 20,
    zIndex: 1,
  },
  contentHeader: {
    color: "#93929c",
    marginLeft: 10,
    marginTop: 10,
    fontWeight: "bold",
    fontSize: 25,
  },
});