export const validateEndDateGreaterThanStartDate = (start: string, end: string) => {
    const startDate = (new Date(start)).getTime();
    const endDate = (new Date(end)).getTime();

    return (endDate - startDate) > 0;
}
