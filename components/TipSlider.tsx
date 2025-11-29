import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

interface TipSliderProps {
    value: number;
    onValueChange: (value: number) => void;
}

const TipSlider: React.FC<TipSliderProps> = ({ value, onValueChange }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tip Percentage</Text>
            <View style={styles.valueContainer}>
                <Text style={styles.value}>{value.toFixed(1)}%</Text>
            </View>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={25}
                step={0.1}
                value={value}
                onValueChange={onValueChange}
                minimumTrackTintColor="#4CAF50"
                maximumTrackTintColor="#000000"
                thumbTintColor="#4CAF50"
            />
            <View style={styles.rangeLabels}>
                <Text style={styles.rangeText}>10%</Text>
                <Text style={styles.rangeText}>25%</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    valueContainer: {
        marginBottom: 10,
    },
    value: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#333',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    rangeText: {
        fontSize: 12,
        color: '#999',
    },
});

export default TipSlider;
