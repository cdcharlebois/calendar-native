import { StyleSheet, Platform, Dimensions } from "react-native";

export const styleConstructor = (theme = {}) => {
    const appStyle = { ...theme };
    const isAndroid = Platform.OS === "android";
    return StyleSheet.create({
        container: {
            alignSelf: "stretch",
            alignItems: "center"
        },
        base: {
            height: Dimensions.get("window").width / 8,
            width: "100%",
            alignItems: "center",
            paddingTop: isAndroid ? 2 : 3
        },
        text: {
            textAlign: "center",
            lineHeight: 20,
            marginTop: 0,
            fontSize: appStyle.textDayFontSize,
            fontFamily: appStyle.textDayFontFamily,
            fontWeight: appStyle.textDayFontWeight,
            color: appStyle.dayTextColor || "#0D7980",
            backgroundColor: "rgba(255, 255, 255, 0)",
            ...appStyle.textDayStyle
        },
        alignedText: {
            marginTop: 0
        },
        selected: {
            borderColor: appStyle.selectedDayBorderColor
        },
        trueSelected: {
            borderStyle: "solid",
            paddingTop: isAndroid ? 0 : 1,
            borderWidth: 2,
            borderColor: appStyle.trueSelectedDayBorderColor || "#14B4BE"
        },
        disabled: {
            backgroundColor: appStyle.disabledDayBackgroundColor
        },
        isPastToday: {
            backgroundColor: appStyle.isPastTodayDayBackgroundColor || "#EEEEEE"
        },
        today: {
            backgroundColor: appStyle.todayBackgroundColor,
            borderRadius: 16
        },
        todayText: {
            color: appStyle.todayTextColor || "#0D7980"
        },
        selectedText: {
            color: appStyle.selectedDayTextColor || "#0D7980"
        },
        disabledText: {
            color: appStyle.textDisabledColor || "#0D7980"
        },
        isPastTodayText: {
            color: appStyle.textIsPastTodayColor || "#C6C6C6"
        },
        inactiveText: {
            color: appStyle.textInactiveColor || "#0D7980"
        },
        dot: {
            height: 15,
            width: 15,
            borderRadius: 200,
            borderWidth: 2,
            borderStyle: "solid",
            marginTop: 1,
            opacity: 0,
            ...appStyle.dotStyle
        },
        visibleDot: {
            opacity: 1,
            backgroundColor: appStyle.dotColor
        },
        selectedDot: {
            backgroundColor: appStyle.selectedDotColor
        },
        disabledDot: {
            backgroundColor: appStyle.disabledDotColor || appStyle.dotColor
        },
        todayDot: {
            backgroundColor: appStyle.todayDotColor || appStyle.dotColor
        },
        todayMarker: {
            position: "absolute",
            top: 0,
            left: 0,
            width: 4,
            height: 4,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderRightWidth: 8,
            borderTopWidth: 8,
            borderRightColor: "transparent",
            borderTopColor: appStyle.topMarkerColor || "#14B4BE"
        },
        ...(theme["stylesheet.day.CustomDay"] || {})
    });
};
