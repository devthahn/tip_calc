import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ResultCardProps {
    foodCost: number;
    taxAmount: number;
    tipAmount: number;
    totalAmount: number;
    onRound: () => void;
}

export default function ResultCard({ foodCost, taxAmount, tipAmount, totalAmount, onRound }: ResultCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Bill</Text>
                <Text style={styles.value}>${foodCost.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Tax</Text>
                <Text style={styles.value}>${taxAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Tip</Text>
                <Text style={styles.value}>${tipAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <View style={styles.totalRight}>
                    <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                    <TouchableOpacity style={styles.roundButton} onPress={onRound}>
                        <Text style={styles.roundButtonText}>Round</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        color: '#666',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    totalRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginRight: 10,
    },
    roundButton: {
        backgroundColor: '#E0E0E0',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    roundButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#555',
    },
});
