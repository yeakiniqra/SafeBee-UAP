import React, { useState, useEffect } from 'react';
import { View, Text, Platform, TextInput, Modal, TouchableOpacity, ActivityIndicator } from 'react-native';
import Mapbox, { MapView, Camera, MarkerView, LocationPuck } from '@rnmapbox/maps';
import { db } from '../firebaseConfig';
import * as Location from 'expo-location';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/authContext';
import { useFonts } from 'expo-font';

const accessToken = process.env.MAPBOX_ACCESS_TOKEN;
Mapbox.setAccessToken(accessToken);

export default function Map() {
    const [markerCoords, setMarkerCoords] = useState(null); 
    const [locationName, setLocationName] = useState(''); 
    const [formVisible, setFormVisible] = useState(false); 
    const [disasterType, setDisasterType] = useState('');
    const [description, setDescription] = useState('');
    const [contactInfo, setContactInfo] = useState('');
    const [isRead, setIsRead] = useState(false);
    const [loading, setLoading] = useState(false);
    const [disasterReports, setDisasterReports] = useState([]); 
    const [volunteerMarkers, setVolunteerMarkers] = useState([]); 

    const { user } = useAuth(); 

  
    const onMapPress = async (e) => {
        if (user?.role === 'volunteer') {
            return; 
        }

        const coords = e.geometry.coordinates;
        setMarkerCoords(coords);
        setFormVisible(true); // Show the form

        
        const [longitude, latitude] = coords;
        try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (reverseGeocode.length > 0) {
                const currentLocationName = `${reverseGeocode[0].city}, ${reverseGeocode[0].region}`;
                setLocationName(currentLocationName); 
            } else {
                setLocationName('Unknown Location');
            }
        } catch (error) {
            console.error('Error fetching location name:', error);
            setLocationName('Error fetching location');
        }
    };

    // Submit disaster report to Firebase
    const submitDisasterReport = async () => {
        if (!disasterType) {
            alert('Please select a disaster type');
            return;
        }

        setLoading(true);

        try {
            await addDoc(collection(db, 'disasterReports'), {
                location: locationName || markerCoords, 
                disasterType,
                description,
                contactInfo,
                username: user?.username || 'Anonymous',
                contact: user?.contact || 'No contact info',
                timestamp: new Date(),
                coordinates: markerCoords, 
                isRead: false,
            });

            alert('Disaster report submitted!');
            resetForm();
        } catch (error) {
            console.error('Error submitting report:', error);
            alert('Failed to submit disaster report');
        } finally {
            setLoading(false);
        }
    };

    const fetchDisasterReports = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'disasterReports'));
            const reports = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

           
            setDisasterReports(reports);

            
            const volunteerLocations = reports
                .filter(report => report.volunteerResponded && report.volunteerLocation) 
                .map(report => {
                    const { volunteerLocation } = report;

                    
                    if (volunteerLocation.latitude && volunteerLocation.longitude) {
                        return [volunteerLocation.longitude, volunteerLocation.latitude];
                    }

                   
                    return volunteerLocation;
                });
            // Set volunteer markers for the map
            setVolunteerMarkers(volunteerLocations);
        } catch (error) {
            console.error('Error fetching disaster reports: ', error);
        }
    };




   
    useEffect(() => {
        if (user?.role === 'volunteer') {
            fetchDisasterReports();
        }
    }, [user]);

 
    const resetForm = () => {
        setMarkerCoords(null);
        setLocationName('');
        setDisasterType('');
        setDescription('');
        setContactInfo('');
        setFormVisible(false);
    };

    const [fontsLoaded] = useFonts({
        'Inter-Regular': require('../assets/fonts/Inter_24pt-Regular.ttf'),
        'Inter-Semibold': require('../assets/fonts/Inter_24pt-SemiBold.ttf'),
      });
    
      if (!fontsLoaded) {
        return null;
      }

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                styleURL="mapbox://styles/mapbox/streets-v12"
                onPress={(e) => onMapPress(e)}
            >
                <Camera followZoomLevel={16} followUserLocation />
                <LocationPuck pulsing={{ isEnabled: true }} puckBearingEnabled puckBearing="heading" />

                {/* Marker for the clicked location (user reporting disaster) */}
                {markerCoords && (
                    <MarkerView id="disaster-marker" coordinate={markerCoords}>
                        <View style={{ backgroundColor: 'red', padding: 5, borderRadius: 50 }}>
                            <Text>📍</Text>
                        </View>
                    </MarkerView>
                )}

                {/* Markers for disaster reports (visible only to volunteers) */}
                {user?.role === 'volunteer' &&
                    disasterReports.map((report) => (
                        <MarkerView
                            key={report.id}
                            id={`report-marker-${report.id}`}
                            coordinate={report.coordinates}
                        >
                            <View style={{ backgroundColor: 'yellow', padding: 10, borderRadius: 50 }}>
                                <Text style={{ fontSize: 24 }}>📍</Text>
                            </View>
                        </MarkerView>
                    ))}


                {/* Markers for volunteer locations (visible only to regular users) */}
                {user?.role === 'user' && volunteerMarkers.length > 0 ? (
                    volunteerMarkers.map((coords, index) => (
                        <MarkerView
                            key={`volunteer-marker-${index}`}
                            id={`volunteer-marker-${index}`}
                            coordinate={coords} // Use the coordinates array directly
                        >
                            <View style={{ backgroundColor: 'green', padding: 75, borderRadius: 50 }}>
                                <Text>🚑</Text>
                            </View>
                        </MarkerView>
                    ))
                ) : (
                    user?.role === 'user' && <Text>No Volunteer Responded Yet</Text>
                )}
            </MapView>


            {/* Popup form modal */}
            <Modal visible={formVisible} transparent={true}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
                        <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Inter-Semibold' }} >Report Disaster</Text>
                        <Text style={{ fontFamily: 'Inter-Semibold' }}>Disaster Location: {locationName ? locationName : 'Fetching location...'}</Text>

                        {/* Disaster Type Input */}
                        <TextInput
                            placeholder="Type of disaster (flood, earthquake, etc.)"
                            value={disasterType}
                            onChangeText={setDisasterType}
                            style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
                        />

                        {/* Description Input */}
                        <TextInput
                            placeholder="Description (optional)"
                            value={description}
                            onChangeText={setDescription}
                            multiline={true}
                            style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
                        />

                        {/* Contact Info Input */}
                        <TextInput
                            placeholder="Contact Info (optional)"
                            value={contactInfo}
                            onChangeText={setContactInfo}
                            style={{ borderWidth: 1, marginVertical: 10, padding: 8 }}
                        />

                        {/* Submit and Cancel buttons */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={resetForm}
                                style={{ padding: 10, backgroundColor: 'gray', borderRadius: 5 }}
                            >
                                <Text style={{ color: 'white', fontFamily: 'Inter-Semibold' }}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={submitDisasterReport}
                                style={{ padding: 10, backgroundColor: 'green', borderRadius: 5 }}
                                disabled={loading}
                            >
                                <Text style={{ color: 'white', fontFamily: 'Inter-Semibold' }}>{loading ? 'Submitting...' : 'Submit'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
