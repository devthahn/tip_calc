import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ResultCardProps {
    foodCost: number;
    taxAmount: number;
    tipAmount: number;
    totalAmount: number;
    krwAmount?: number;
    exchangeRate?: number;
    lastUpdated?: Date;
    onRound: () => void;
}

export default function ResultCard({ foodCost, taxAmount, tipAmount, totalAmount, krwAmount, exchangeRate, lastUpdated, onRound }: ResultCardProps) {
    const formatDate = (date: Date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${month}/${day} ${hours}:${minutes}`;
    }

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
                <View style={styles.totalRightColumn}>
                    <View style={styles.totalAmountRow}>
                        <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
                        <TouchableOpacity style={styles.roundButton} onPress={onRound}>
                            <Text style={styles.roundButtonText}>Round</Text>
                        </TouchableOpacity>
                    </View>

                    {exchangeRate !== undefined && exchangeRate > 0 && (
                        <Text style={styles.rateText}>
                            ({lastUpdated ? formatDate(lastUpdated) : ''}) $1 = ₩ {exchangeRate.toFixed(2)}
                        </Text>
                    )}

                    {krwAmount !== undefined && (
                        <Text style={styles.krwValue}>₩{krwAmount.toLocaleString()}</Text>
                    )}
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
        alignItems: 'flex-start', // Align to top so label stays up matching total
        marginTop: 5,
    },
    totalLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5, // Visual alignment with the first row of right column
    },
    totalRightColumn: {
        alignItems: 'flex-end',
    },
    totalAmountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    totalValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginRight: 10,
    },
    rateText: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    krwValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
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
