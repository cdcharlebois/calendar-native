import { createElement, useState, useEffect } from "react";
import { View, Text } from "react-native";

import { Calendar as CalWidget, LocaleConfig } from "react-native-calendars/src/index.js";
/**
 * See here for the original implementation:
 * https://github.com/mendixlabs/app-services-components/blob/main/apps/native-widgets/calendar-native-widget/src/components/CalendarInit.tsx
 */
const defaultDot = {
    marked: true,
    activeOpacity: 0
};
const DOTS = {
    red: {
        ...defaultDot,
        dotColor: "red"
    },
    yellow: {
        ...defaultDot,
        dotColor: "gold"
    },
    green: {
        ...defaultDot,
        dotColor: "green"
    }
};

const CustomDay = ({ state, marking, date }) => {
    return (
        <View>
            <Text style={{ textAlign: "center", color: state === "disabled" ? "gray" : "black" }}>{date.day}</Text>
        </View>
    );
};

export function Calendar({ selectedDate, useCustomDay, events, colorExpr, dateAttr, style }) {
    const [markedDates, setMarkedDates] = useState({
        "2022-12-13": DOTS.red,
        "2022-12-14": DOTS.yellow,
        "2022-12-15": DOTS.green
    });
    useEffect(() => {
        getMarkedDates();
    }, [events])
    const getMarkedDates = () => {
        // console.warn("getMarkedDates");
        if (events.status !== "available") return null
        // console.warn("getMarkedDates - actually running");
        let days = {};
        // console.info(events.items.length)
        events.items.forEach(day => {
            // console.info(day)
            // console.info(dateAttr.get(day))
            // console.info(new Date(dateAttr.get(day)))
            const objectDate = new Date(dateAttr.get(day).value)
            days[`${objectDate.getFullYear()}-${objectDate.getMonth()+1}-${objectDate.getDate()}`] = {...defaultDot,dotColor:colorExpr.get(day).value}
        })
        // console.info(days)
        setMarkedDates(days);
    }
    const handleDateSelected = date => {
        const selectedDateValueDate = new Date(date.year, date.month - 1, date.day);
        if (selectedDate && selectedDate.status === "available") {
            selectedDate.setValue(selectedDateValueDate);
        }
    };
    return (
        <CalWidget
            onDayPress={handleDateSelected}
            markedDates={markedDates}
            dayComponent={useCustomDay ? CustomDay : undefined}
        />
    );
}
