import React from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import LottieView from "lottie-react-native";

export default function LoadingLottie() {
    return (
        <View style={styles.container}>
            <View style={styles.layout}>
            </View>
            <View style={styles.componient}>
                <LottieView
                    source={require("../../asset/98288-loading.json")}
                    style={styles.animation}
                    autoPlay
                />
                <Text>Loading...</Text>
            </View>
        </View>
    );
}

const width_window = Dimensions.get("window").width
const height_window = Dimensions.get("window").height

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: 'center',
        width: width_window,
        height: height_window,
    },

    animation: {
        width: 100,
        height: 100,
    },

    layout: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width_window,
        height: height_window,
        backgroundColor: '#000',
        opacity: 0.35,
    },

    componient: {
        justifyContent: "center",
        alignItems: 'center',
        width: width_window * 0.89,
        height: height_window * 0.19,
        paddingBottom: 15,
        backgroundColor: '#fff',
    }
});

