import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';

interface TipSliderProps {
    value: number;
    onValueChange: (value: number) => void;
    enabled?: boolean;
    onToggle?: () => void;
}

const TipSlider: React.FC<TipSliderProps> = ({ value, onValueChange, enabled = true, onToggle }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Tip Percentage</Text>

            <View style={styles.valueContainer}>
                <Text style={[styles.value, !enabled && styles.valueDisabled]}>{value.toFixed(1)}%</Text>
            </View>

            <View style={styles.sliderRow}>
                {onToggle && (
                    <TouchableOpacity
                        style={[styles.toggleButton, !enabled && styles.toggleButtonActive]}
                        onPress={onToggle}
                    >
                        <Text style={[styles.toggleButtonText, !enabled && styles.toggleButtonTextActive]}>
                            {enabled ? "No Tip" : "No Tip"}
                        </Text>
                    </TouchableOpacity>
                )}

                <Slider
                    style={styles.slider}
                    minimumValue={10}
                    maximumValue={25}
                    step={0.1}
                    value={enabled ? value : 0}
                    onValueChange={onValueChange}
                    minimumTrackTintColor={enabled ? "#A855F7" : "#555"}
                    maximumTrackTintColor="rgba(255, 255, 255, 0.1)"
                    thumbTintColor={enabled ? "#A855F7" : "#555"}
                    disabled={!enabled}
                />
            </View>

            <View style={styles.labelsRow}>
                {/* Spacer to match button width (60) + margin (10) */}
                {onToggle && <View style={{ width: 70 }} />}
                <View style={styles.rangeLabels}>
                    <Text style={styles.rangeText}>10%</Text>
                    <Text style={styles.rangeText}>25%</Text>
                </View>
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
        color: '#AAA',
        marginBottom: 10,
    },
    sliderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    toggleButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        marginRight: 10,
        height: 40,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    toggleButtonActive: {
        backgroundColor: '#A855F7',
        borderColor: '#A855F7',
    },
    toggleButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#AAA',
        textAlign: 'center',
    },
    toggleButtonTextActive: {
        color: '#FFF',
    },
    valueContainer: {
        marginBottom: 10,
    },
    value: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFF',
        textShadowColor: 'rgba(255, 255, 255, 0.2)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    valueDisabled: {
        color: '#555',
        textShadowColor: 'transparent',
    },
    slider: {
        flex: 1, // Take remaining width
        height: 40,
    },
    labelsRow: {
        flexDirection: 'row',
        width: '100%',
    },
    rangeLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1, // Match slider width
        paddingHorizontal: 10,
    },
    rangeText: {
        fontSize: 12,
        color: '#666',
    },
});

export default TipSlider;
