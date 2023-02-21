import { createElement, useState, useEffect } from "react";
import { Image, View, TouchableOpacity, Text } from "react-native";

import { Calendar as CalWidget, LocaleConfig } from "react-native-calendars/src/index.js";

import { getDate, getDateString, monthsBetween } from "./DateUtils";

import { mergeNativeStyles } from "@mendix/pluggable-widgets-tools";

import CustomDay from "./components/CustomDay";

import { Big } from "big.js";
/**
 * See here for the original implementation:
 * https://github.com/mendixlabs/app-services-components/blob/main/apps/native-widgets/calendar-native-widget/src/components/CalendarInit.tsx
 */

const defaultDot = {
    marked: true
};

const defaultStyle = {
    container: {
        paddingLeft: 0,
        paddingRight: 0,
        borderRadius: 16,
        overflow: "hidden"
    },
    theme: {
        "stylesheet.calendar.main": {
            week: {
                borderTopColor: "#C6C6C6",
                borderTopWidth: 1,
                flexDirection: "row",
                justifyContent: "space-around"
            }
        },
        monthTextColor: "#0D7980",
        textSectionTitleColor: "#0D7980",
        textDayFontSize: 16,
        textMonthFontSize: 16,
        textDayHeaderFontSize: 14,
        textMonthFontWeight: "bold",
        textDayHeaderFontWeight: "bold",
        textDayFontWeight: "bold"
    },
    arrow: {
        height: 16,
        width: 16
    }
};

LocaleConfig.defaultLocale = "CurrentLocale";

export function Calendar({
    selectedDate,
    monthsFromPresentAttr,
    useCustomDay,
    events,
    colorExpr,
    dateAttr,
    onPress,
    leftImage,
    rightImage,
    monthNames,
    monthNamesShort,
    dayNames,
    dayNamesShort,
    today,
    style,
    customDayWidgets
}) {
    // eslint-disable-next-line dot-notation
    if (
        monthNames.status === "available" &&
        monthNamesShort.status === "available" &&
        dayNames.status === "available" &&
        dayNamesShort.status === "available" &&
        today.status === "available"
    ) {
        const parseCS = list => list.split(",").map(item => item.trim());
        // eslint-disable-next-line dot-notation
        LocaleConfig.locales["CurrentLocale"] = {
            monthNames: parseCS(monthNames.value),
            monthNamesShort: parseCS(monthNamesShort.value),
            dayNames: parseCS(dayNames.value),
            dayNamesShort: parseCS(dayNamesShort.value),
            today: today.value.trim()
        };
    }
    const styles = mergeNativeStyles(defaultStyle, style);

    const [markedDates, setMarkedDates] = useState({});

    const [currentMonth, setCurrentMonth] = useState(0);
    const [dateSelected, setDateSelected] = useState(getDateString(getDate()));

    const setCurrentMonthAndAttr = newMonth => {
        setCurrentMonth(newMonth);
        if (monthsFromPresentAttr && monthsFromPresentAttr.status === "available") {
            monthsFromPresentAttr.setValue(Big(newMonth));
        }
    };

    const updateMonth = date => {
        const currentMonthCalculated = monthsBetween(getDate(), date);
        if (currentMonthCalculated !== currentMonth) {
            setCurrentMonthAndAttr(currentMonthCalculated);
        }
    };

    const renderArrow = direction => {
        const isLeft = direction === "left";
        const imageSource = isLeft
            ? leftImage && leftImage.value
                ? leftImage.value
                : ""
            : rightImage && rightImage.value
            ? rightImage.value
            : "";
        return isLeft || !(currentMonth === 0) ? (
            <Image source={imageSource} style={style && style.arrow ? style.arrow : styles.arrow} />
        ) : (
            <View />
        );
    };

    useEffect(() => {
        getMarkedDates();
    }, [events]);

    useEffect(() => {
        if (selectedDate.value) {
            updateMonth(selectedDate.value);
            setDateSelected(getDateString(selectedDate.value));
        }
    }, [selectedDate.value ? selectedDate.value.valueOf() : NaN]);

    function getMarkedDates() {
        if (!events || events.status !== "available") return;

        const days = {};

        events.items.forEach(day => {
            const objectDate = new Date(dateAttr.get(day).value);
            days[getDateString(objectDate)] = {
                ...defaultDot,
                dotColor: colorExpr.get(day).value,
                itemRef: day
            };
        });

        setMarkedDates(days);
    }

    const handleDateSelected = date => {
        const selectedDateValueDate = new Date(date.year, date.month - 1, date.day);
        if (selectedDate && selectedDate.status === "available") {
            if (selectedDate.value?.toDateString() !== selectedDateValueDate.toDateString()) {
                selectedDate.setValue(selectedDateValueDate);
            } else {
                updateMonth(selectedDateValueDate);
            }
        }
        if (onPress && onPress.canExecute) {
            onPress.execute();
        }
    };

    if (
        leftImage.status !== "available" ||
        !leftImage.value ||
        rightImage.status !== "available" ||
        !rightImage.value ||
        !selectedDate ||
        selectedDate.status !== "available" ||
        // eslint-disable-next-line dot-notation
        !LocaleConfig.locales["CurrentLocale"]
    ) {
        return null;
    }

    const renderCustomDay = ({ marking, state, date }) => {
        if (events.status !== "available") return null;
        if (marking && marking.itemRef) {
            console.warn("marking", marking);
        }
        // TODO: render the mendix content inline with the default calendar rendering
        return marking && marking.itemRef ? (
            customDayWidgets.get(marking.itemRef)
        ) : (
            <TouchableOpacity>
                <Text>foo</Text>
            </TouchableOpacity>
        );
    };

    return (
        <CalWidget
            initialDate={dateSelected}
            renderArrow={renderArrow}
            onDayPress={handleDateSelected}
            maxDate={getDateString(new Date())}
            markingType={"custom"}
            markedDates={{
                ...markedDates,
                ...{
                    [dateSelected]: {
                        ...markedDates[dateSelected],
                        isTrueSelected: true
                    }
                }
            }}
            style={styles.container}
            theme={styles.theme}
            onPressArrowLeft={subtractMonth => {
                setCurrentMonthAndAttr(currentMonth - 1);
                subtractMonth();
                if (onPress && onPress.canExecute) {
                    onPress.execute();
                }
            }}
            onPressArrowRight={addMonth => {
                setCurrentMonthAndAttr(currentMonth + 1);
                addMonth();
                if (onPress && onPress.canExecute) {
                    onPress.execute();
                }
            }}
            // eslint-disable-next-line prettier/prettier
            disableArrowRight={currentMonth >= 0}
            dayComponent={useCustomDay ? renderCustomDay : CustomDay}
            firstDay={1}
        />
    );
}
