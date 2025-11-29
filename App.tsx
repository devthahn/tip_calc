import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { getCurrentLocation } from './services/LocationService';
import { getTaxRate } from './services/TaxService';
import TipSlider from './components/TipSlider';
import ResultCard from './components/ResultCard';

export default function App() {
  const [foodCost, setFoodCost] = useState('');
  const [tipPercentage, setTipPercentage] = useState(15);
  const [taxAmount, setTaxAmount] = useState('');
  const [taxRate, setTaxRate] = useState(0);
  const [taxRateInput, setTaxRateInput] = useState('0');
  const [locationState, setLocationState] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    setLoadingLocation(true);
    const location = await getCurrentLocation();
    if (location) {
      const region = (location as any).region;
      const zip = (location as any).zipCode || (location as any).postalCode;

      setLocationState(region);
      setZipCode(zip);

      const rate = getTaxRate(region, zip);
      setTaxRate(rate);
      setTaxRateInput(rate.toFixed(2)); // Initialize taxRateInput with the fetched rate
    }
    setLoadingLocation(false);
  };

  // Auto-calculate tax amount when food cost changes, keeping the RATE constant
  useEffect(() => {
    if (foodCost && taxRate > 0) {
      const cost = parseFloat(foodCost);
      if (!isNaN(cost)) {
        const calculatedTax = (cost * (taxRate / 100)).toFixed(2);
        // Only update if the amount is significantly different to avoid rounding loops
        if (Math.abs(parseFloat(calculatedTax) - (parseFloat(taxAmount) || 0)) > 0.01) {
          setTaxAmount(calculatedTax);
        }
      }
    }
  }, [foodCost]); // Only run when foodCost changes, relying on existing taxRate


  const handleFoodCostChange = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setFoodCost(text);
    }
  };

  const handleTaxAmountChange = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setTaxAmount(text);

      // Recalculate Rate based on new Amount
      const cost = parseFloat(foodCost);
      const amount = parseFloat(text);
      if (cost > 0 && !isNaN(amount)) {
        const newRate = (amount / cost) * 100;
        setTaxRate(newRate);
        setTaxRateInput(newRate.toFixed(2));
      }
    }
  };

  const handleTaxRateChange = (text: string) => {
    if (/^\d*\.?\d*$/.test(text)) {
      setTaxRateInput(text);
      const newRate = parseFloat(text);
      if (!isNaN(newRate)) {
        setTaxRate(newRate);

        // Recalculate Amount based on new Rate
        const cost = parseFloat(foodCost);
        if (cost > 0) {
          const newAmount = (cost * (newRate / 100)).toFixed(2);
          setTaxAmount(newAmount);
        }
      }
    }
  };

  const calculateTotals = () => {
    const cost = parseFloat(foodCost) || 0;
    const tax = parseFloat(taxAmount) || 0;
    const tip = cost * (tipPercentage / 100);
    const total = cost + tax + tip;
    return { cost, tax, tip, total };
  };

  const { cost, tax, tip, total } = calculateTotals();

  const handleRound = () => {
    if (cost === 0) return;

    const currentTotal = total;
    const roundedTotal = Math.round(currentTotal);

    let newTip = roundedTotal - cost - tax;

    if (newTip < 0) newTip = 0;

    const newPercentage = (newTip / cost) * 100;
    setTipPercentage(newPercentage);
  };

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={foodCost}
          onChangeText={handleFoodCostChange}
          placeholderTextColor="#ccc"
        />
      </View>

      <View style={styles.splitTaxContainer}>
        <View style={styles.taxInputWrapper}>
          <Text style={styles.taxLabel}>Tax $</Text>
          <TextInput
            style={styles.taxInput}
            value={taxAmount}
            onChangeText={handleTaxAmountChange}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>
        <View style={styles.taxInputWrapper}>
          <Text style={styles.taxLabel}>Rate %</Text>
          <TextInput
            style={styles.taxInput}
            value={taxRateInput}
            onChangeText={handleTaxRateChange}
            keyboardType="numeric"
            placeholder="0.0"
          />
        </View>
      </View>

      <TipSlider value={tipPercentage} onValueChange={setTipPercentage} />

      <ResultCard
        foodCost={cost}
        taxAmount={tax}
        tipAmount={tip}
        totalAmount={total}
        onRound={handleRound}
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {Platform.OS === 'web' ? (
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />

          <View style={styles.header}>
            <Text style={styles.title}>Tip Calculator</Text>
            <View style={styles.locationContainer}>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <Text style={styles.locationText}>
                  {locationState ? `${locationState} ${zipCode ? `(${zipCode})` : ''}` : 'Location not found'}
                </Text>
              )}
            </View>
          </View>

          {renderContent()}
        </SafeAreaView>
      ) : (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />

            <View style={styles.header}>
              <Text style={styles.title}>Tip Calculator</Text>
              <View style={styles.locationContainer}>
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <Text style={styles.locationText}>
                    {locationState ? `${locationState} ${zipCode ? `(${zipCode})` : ''}` : 'Location not found'}
                  </Text>
                )}
              </View>
            </View>

            {renderContent()}
          </SafeAreaView>
        </TouchableWithoutFeedback>
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '300',
    color: '#333',
    marginRight: 5,
  },
  input: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 100,
    textAlign: 'center',
  },
  splitTaxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  taxInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    width: '48%', // Split width
    justifyContent: 'center'
  },
  taxLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginRight: 5,
  },
  taxInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
  },
});
