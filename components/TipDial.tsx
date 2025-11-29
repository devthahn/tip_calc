import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedProps, runOnJS } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SIZE = width * 0.7;
const STROKE_WIDTH = 40;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface TipDialProps {
    value: number;
    onValueChange: (value: number) => void;
}

export default function TipDial({ value, onValueChange }: TipDialProps) {
    const progress = useSharedValue(value / 100);

    useEffect(() => {
        progress.value = value / 100;
    }, [value]);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            const x = e.x - SIZE / 2;
            const y = e.y - SIZE / 2;
            let angle = Math.atan2(y, x);

            let normalizedAngle = angle + Math.PI / 2;
            if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

            let newProgress = normalizedAngle / (2 * Math.PI);

            if (newProgress < 0) newProgress = 0;
            if (newProgress > 1) newProgress = 1;

            progress.value = newProgress;
            runOnJS(onValueChange)(Math.round(newProgress * 100));
        });

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = CIRCUMFERENCE * (1 - progress.value);
        return {
            strokeDashoffset,
        };
    });

    return (
        <View style={styles.container}>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={styles.dialContainer}>
                    <Svg width={SIZE} height={SIZE}>
                        <Circle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke="#E0E0E0"
                            strokeWidth={STROKE_WIDTH}
                            fill="none"
                        />
                        <AnimatedCircle
                            cx={SIZE / 2}
                            cy={SIZE / 2}
                            r={RADIUS}
                            stroke="#4CAF50"
                            strokeWidth={STROKE_WIDTH}
                            strokeDasharray={CIRCUMFERENCE}
                            animatedProps={animatedProps}
                            strokeLinecap="round"
                            rotation="-90"
                            origin={`${SIZE / 2}, ${SIZE / 2}`}
                            fill="none"
                        />
                    </Svg>
                    <View style={styles.textContainer}>
                        <Text style={styles.percentageText}>{Math.round(value)}%</Text>
                        <Text style={styles.label}>Tip</Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dialContainer: {
        width: SIZE,
        height: SIZE,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        pointerEvents: 'none',
    },
    percentageText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
    },
    label: {
        fontSize: 18,
        color: '#666',
    },
});
