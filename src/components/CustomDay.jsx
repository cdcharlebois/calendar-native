import React, { Fragment, useCallback, useRef, createElement } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { getDate, getDateString } from "../dateUtils";
import { styleConstructor } from "./customDayStyle";

const CustomDay = props => {
    const {
        theme,
        date,
        onPress,
        onLongPress,
        marking,
        state,
        disableAllTouchEventsForDisabledDays,
        disableAllTouchEventsForInactiveDays,
        accessibilityLabel,
        children,
        testID
    } = props;
    const style = useRef(styleConstructor(theme));
    const _marking = marking || {};
    const isSelected = _marking.selected || state === "selected";
    const today = getDate();
    const isPastToday =
        date.year > today.getFullYear() ||
        (date.year === today.getFullYear() &&
            (date.month > today.getMonth() + 1 || (date.month === today.getMonth() + 1 && date.day > today.getDate())));
    const isDisabled = typeof _marking.disabled !== "undefined" ? _marking.disabled : state === "disabled";
    const isInactive = _marking?.inactive;
    const isTodayState = state === "today";

    const shouldDisableTouchEvent = () => {
        const { disableTouchEvent } = _marking;
        let disableTouch = false;
        if (typeof disableTouchEvent === "boolean") {
            disableTouch = disableTouchEvent;
        } else if (typeof disableAllTouchEventsForDisabledDays === "boolean" && isDisabled) {
            disableTouch = disableAllTouchEventsForDisabledDays;
        } else if (typeof disableAllTouchEventsForInactiveDays === "boolean" && isInactive) {
            disableTouch = disableAllTouchEventsForInactiveDays;
        } else if (isPastToday) {
            disableTouch = true;
        }
        return disableTouch;
    };

    const getTodayMarkerStyle = () => {
        const { customStyles } = _marking;
        const styles = [style.current.todayMarker];

        //Custom marking type
        if (customStyles && customStyles.todayMarker) {
            styles.push(customStyles.todayMarker);
        }

        return styles;
    };

    const getDotStyle = () => {
        const { customStyles, dotColor, marked } = _marking;
        const styles = [style.current.dot];

        //Custom marking type
        if (customStyles && customStyles.dot) {
            styles.push(customStyles.dot);
        }

        if (marked) {
            styles.push(style.current.visibleDot);
        }

        if (dotColor) {
            styles.push({ borderColor: dotColor });
        }

        return styles;
    };

    const getContainerStyle = () => {
        const { customStyles, isTrueSelected, trueSelectedColor, selectedColor } = _marking;
        const styles = [style.current.base];
        if (isTrueSelected) {
            styles.push(style.current.trueSelected);
            if (trueSelectedColor) {
                styles.push({ backgroundColor: trueSelectedColor });
            }
        } else if (isTodayState) {
            styles.push(style.current.today);
        } else if (isPastToday) {
            styles.push(style.current.isPastToday);
        } else if (isDisabled) {
            styles.push(style.current.disabled);
        } else if (isSelected) {
            styles.push(style.current.selected);
            if (selectedColor) {
                styles.push({ backgroundColor: selectedColor });
            }
        }

        //Custom marking type
        if (customStyles && customStyles.container) {
            if (customStyles.container.borderRadius === undefined) {
                customStyles.container.borderRadius = 16;
            }
            styles.push(customStyles.container);
        }

        return styles;
    };

    const getTextStyle = () => {
        const { customStyles, selectedTextColor } = _marking;
        const styles = [style.current.text];

        if (isPastToday) {
            styles.push(style.current.isPastTodayText);
        } else if (isSelected) {
            styles.push(style.current.selectedText);
            if (selectedTextColor) {
                styles.push({ color: selectedTextColor });
            }
        } else if (isDisabled) {
            styles.push(style.current.disabledText);
        } else if (isTodayState) {
            styles.push(style.current.todayText);
        } else if (isInactive) {
            styles.push(style.current.inactiveText);
        }

        //Custom marking type
        if (customStyles && customStyles.text) {
            styles.push(customStyles.text);
        }

        return styles;
    };

    const _onPress = useCallback(() => {
        onPress?.(date);
    }, [onPress, date]);

    const _onLongPress = useCallback(() => {
        onLongPress?.(date);
    }, [onLongPress, date]);

    const renderTodayMarker = () =>
        date.dateString === getDateString(getDate()) ? <View style={getTodayMarkerStyle()} /> : null;

    const renderDot = () => {
        const { marked } = _marking;
        return marked ? <View style={getDotStyle()} /> : null;
    };

    const renderText = () => (
        <Text allowFontScaling={false} style={getTextStyle()}>
            {String(children)}
        </Text>
    );

    const renderContent = () => (
        <Fragment>
            {renderText()}
            {renderDot()}
            {renderTodayMarker()}
        </Fragment>
    );

    return (
        <TouchableOpacity
            testID={testID}
            style={getContainerStyle()}
            disabled={shouldDisableTouchEvent()}
            activeOpacity={_marking.activeOpacity}
            onPress={!shouldDisableTouchEvent() ? _onPress : undefined}
            onLongPress={!shouldDisableTouchEvent() ? _onLongPress : undefined}
            accessible
            accessibilityRole={isDisabled ? undefined : "button"}
            accessibilityLabel={accessibilityLabel}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

export default CustomDay;
CustomDay.displayName = "CustomDay";
