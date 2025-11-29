import * as Location from 'expo-location';
import { Platform } from 'react-native';

export const getCurrentLocation = async () => {
    try {
        console.log('Requesting permissions...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Permission status:', status);
        if (status !== 'granted') {
            console.log('Permission to access location was denied');
            return null;
        }

        console.log('Getting current position...');
        const location = await Location.getCurrentPositionAsync({});
        console.log('Position:', location);

        console.log('Reverse geocoding...');
        let reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
        console.log('Reverse geocode result:', reverseGeocode);

        if (Platform.OS === 'web' && (!reverseGeocode || reverseGeocode.length === 0 || !reverseGeocode[0].region)) {
            console.log('Expo geocoding failed on web, trying OpenStreetMap...');
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.coords.latitude}&lon=${location.coords.longitude}`
                );
                const data = await response.json();
                console.log('OSM data:', data);
                if (data.address && data.address.state) {
                    return {
                        region: data.address.state,
                        isoCountryCode: data.address.country_code?.toUpperCase(),
                        zipCode: data.address.postcode
                    } as any;
                }
            } catch (err) {
                console.error('OSM fallback failed:', err);
            }
        }

        if (reverseGeocode && reverseGeocode.length > 0) {
            const result = reverseGeocode[0];
            return {
                ...result,
                zipCode: result.postalCode // Ensure we return a consistent zipCode property
            };
        }
        return null;
    } catch (error) {
        console.error('Error fetching location:', error);
        return null;
    }
};
