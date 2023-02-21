export const getDate = () => new Date();

export const monthsBetween = (date1, date2) => {
    const months = (date2.getFullYear() - date1.getFullYear()) * 12 + date2.getMonth() - date1.getMonth();
    return months;
};

export const isCurrentMonth = month => monthsBetween(getDate(), month) === 0;

export const getDateString = date =>
    date
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")}`
        : "";
