import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, SafeAreaView, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Platform, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { getCurrentLocation } from './services/LocationService';
import { getTaxRate } from './services/TaxService';
import { getExchangeRate } from './services/CurrencyService';
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
  const [exchangeRate, setExchangeRate] = useState(0);
  const [krwAmount, setKrwAmount] = useState(0);
  const [isTipEnabled, setIsTipEnabled] = useState(true);
  const [savedTipPercentage, setSavedTipPercentage] = useState(15);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

  useEffect(() => {
    loadLocation();
    loadExchangeRate();
  }, []);

  const loadExchangeRate = async () => {
    const rate = await getExchangeRate('USD', 'KRW');
    setExchangeRate(rate);
    setLastUpdated(new Date());
  };

  const loadLocation = async () => {
    setLoadingLocation(true);
    const location = await getCurrentLocation();
    if (location) {
      const region = (location as any).region;
      const zip = (location as any).zipCode || (location as any).postalCode;

      setLocationState(region);
      setZipCode(zip);

      const rate = await getTaxRate(region, zip);
      const validRate = isNaN(rate) ? 0 : rate;
      setTaxRate(validRate);
      setTaxRateInput(validRate.toFixed(2)); // Initialize taxRateInput with the fetched rate
    }
    setLoadingLocation(false);
  };

  const calculateTaxAmount = (cost: number, rate: number): string => {
    if (isNaN(cost) || isNaN(rate)) return '0.00';
    const tax = cost * (rate / 100);
    // Round to nearest cent explicitly
    // e.g. 0.775 -> 77.5 -> 78 -> 0.78
    return (Math.round(tax * 100) / 100).toFixed(2);
  };


  // Auto-calculate tax amount when food cost changes, keeping the RATE constant
  useEffect(() => {
    if (foodCost && taxRate > 0) {
      const cost = parseFloat(foodCost);
      if (!isNaN(cost)) {
        const calculatedTax = calculateTaxAmount(cost, taxRate);
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
          const newAmount = calculateTaxAmount(cost, newRate);
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

  useEffect(() => {
    if (exchangeRate > 0) {
      setKrwAmount(Math.round(total * exchangeRate));
    }
  }, [total, exchangeRate]);

  const handleRound = () => {
    if (cost === 0) return;

    const currentTotal = total;
    const roundedTotal = Math.round(currentTotal);

    let newTip = roundedTotal - cost - tax;

    if (newTip < 0) newTip = 0;

    const newPercentage = (newTip / cost) * 100;
    setTipPercentage(newPercentage);
    // If we round, we ensure tip is enabled if it wasn't
    if (!isTipEnabled) {
      setIsTipEnabled(true);
    }
  };

  const handleTipToggle = () => {
    if (isTipEnabled) {
      // Disable tip
      setSavedTipPercentage(tipPercentage);
      setTipPercentage(0);
      setIsTipEnabled(false);
    } else {
      // Enable tip
      setTipPercentage(savedTipPercentage);
      setIsTipEnabled(true);
    }
  };

  const renderContent = () => (
    <View style={styles.content}>
      <View style={styles.mascotContainer} pointerEvents="none">
        <Text style={styles.mascotText}>🐌</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.currencySymbol}>$</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="decimal-pad"
          value={foodCost}
          onChangeText={handleFoodCostChange}
          placeholderTextColor="#5e7a6b"
        />
      </View>

      <View style={styles.splitTaxContainer}>
        <View style={styles.taxInputWrapper}>
          <Text style={styles.taxLabel}>Tax $</Text>
          <TextInput
            style={styles.taxInput}
            value={taxAmount}
            onChangeText={handleTaxAmountChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
          />
        </View>
        <View style={styles.taxInputWrapper}>
          <Text style={styles.taxLabel}>Rate %</Text>
          <TextInput
            style={styles.taxInput}
            value={taxRateInput}
            onChangeText={handleTaxRateChange}
            keyboardType="decimal-pad"
            placeholder="0.0"
          />
        </View>
      </View>

      <TipSlider
        value={tipPercentage}
        onValueChange={(val) => {
          setTipPercentage(val);
          // If user slides, ensure it's enabled
          if (!isTipEnabled && val > 0) setIsTipEnabled(true);
        }}
        enabled={isTipEnabled}
        onToggle={handleTipToggle}
      />

      <ResultCard
        foodCost={cost}
        taxAmount={tax}
        tipAmount={tip}
        totalAmount={total}
        krwAmount={krwAmount}
        exchangeRate={exchangeRate}
        lastUpdated={lastUpdated}
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
            <View style={styles.titleRow}>
              <Image source={require('./assets/icon.png')} style={styles.titleIcon} />
              <Text style={styles.title}>Tip Calculator</Text>
            </View>
            <View style={styles.locationContainer}>
              {loadingLocation ? (
                <ActivityIndicator size="small" color="#4ade80" />
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
              <View style={styles.titleRow}>
                <Image source={require('./assets/icon.png')} style={styles.titleIcon} />
                <Text style={styles.title}>Tip Calculator</Text>
              </View>
              <View style={styles.locationContainer}>
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#4ade80" />
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
    backgroundColor: '#f4faeb',
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    width: 64,
    height: 64,
    marginRight: 8,
    borderRadius: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c3d2e',
    letterSpacing: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: '#5e7a6b',
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
    color: '#5e7a6b',
    marginRight: 5,
  },
  input: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#1c3d2e',
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: 'rgba(74, 222, 128, 0.2)',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    width: '48%', // Split width
    justifyContent: 'center'
  },
  taxLabel: {
    fontSize: 14,
    color: '#5e7a6b',
    fontWeight: '500',
    marginRight: 5,
  },
  taxInput: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c3d2e',
    minWidth: 40,
    textAlign: 'center',
  },
  mascotContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    opacity: 0.1,
    transform: [{ scale: 2 }],
  },
  mascotText: {
    fontSize: 100,
  }
});
