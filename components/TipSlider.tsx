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
                    minimumTrackTintColor={enabled ? "#4ade80" : "#a3b8a8"}
                    maximumTrackTintColor="rgba(28, 61, 46, 0.1)"
                    thumbTintColor={enabled ? "#22c55e" : "#a3b8a8"}
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
        color: '#5e7a6b',
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginRight: 10,
        height: 40,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(74, 222, 128, 0.2)',
    },
    toggleButtonActive: {
        backgroundColor: '#22c55e',
        borderColor: '#22c55e',
    },
    toggleButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#5e7a6b',
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
        color: '#1c3d2e',
        textShadowColor: 'rgba(74, 222, 128, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    valueDisabled: {
        color: '#a3b8a8',
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
        color: '#5e7a6b',
    },
});

export default TipSlider;
