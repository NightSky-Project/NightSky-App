import React from "react";
import {  Image, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect, Path } from 'react-native-svg';


export default function SplashScreen() {
    
    return (
        <View style={styles.loadingContainer}>
            <Image
                source={require('../../assets/splash.png')}
                style={styles.backgroundImage}
            />
            <View style={{ ...styles.svgContainer }}>
                <Logo width={100} height={100} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        height: '100%',
        position: 'absolute',
        resizeMode: 'cover',
        width: '100%',
    },
    loadingContainer: {
        alignItems: 'center',
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 999,
    },
    svgContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const Logo = ({ width = 64, height = 66, ...props }) => (
    <Svg
        fill="none"
        viewBox="0 0 64 66"
        style={[{ width, height }, props.style]}>
        <Defs>
            <LinearGradient id="customGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <Stop offset="0%" stopColor="#f6bf75" stopOpacity="1" />
                <Stop offset="35%" stopColor="#d77185" stopOpacity="1" />
                <Stop offset="65%" stopColor="#8766ac" stopOpacity="1" />
                <Stop offset="100%" stopColor="#4150b1" stopOpacity="1" />
            </LinearGradient>
        </Defs>
        <Path
            fill="url(#customGradient)"
            d="M13.873 3.77C21.21 9.243 29.103 20.342 32 26.3v15.732c0-.335-.13.043-.41.858-1.512 4.414-7.418 21.642-20.923 7.87-7.111-7.252-3.819-14.503 9.125-16.692-7.405 1.252-15.73-.817-18.014-8.93C1.12 22.804 0 8.431 0 6.488 0-3.237 8.579-.18 13.873 3.77ZM50.127 3.77C42.79 9.243 34.897 20.342 32 26.3v15.732c0-.335.13.043.41.858 1.512 4.414 7.418 21.642 20.923 7.87 7.111-7.252 3.819-14.503-9.125-16.692 7.405 1.252 15.73-.817 18.014-8.93C62.88 22.804 64 8.431 64 6.488 64-3.237 55.422-.18 50.127 3.77Z"
        />
    </Svg>
);