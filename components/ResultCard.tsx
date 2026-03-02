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
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderColor: 'rgba(74, 222, 128, 0.2)',
        borderWidth: 1,
        borderRadius: 20,
        padding: 20,
        width: '100%',
        shadowColor: 'rgba(28, 61, 46, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
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
        color: '#5e7a6b',
    },
    value: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1c3d2e',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
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
        color: '#1c3d2e',
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
        color: '#22c55e',
        marginRight: 10,
        textShadowColor: 'rgba(34, 197, 94, 0.3)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
    },
    rateText: {
        fontSize: 12,
        color: '#5e7a6b',
        marginBottom: 2,
    },
    krwValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1c3d2e',
    },
    roundButton: {
        backgroundColor: 'rgba(74, 222, 128, 0.2)',
        borderColor: 'rgba(34, 197, 94, 0.5)',
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    roundButtonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#166534',
    },
});
