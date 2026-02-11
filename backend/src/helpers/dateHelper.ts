
const yesterday_ts = Math.floor(Number(new Date()) / 1000) - 86400;

export const getStartDate = () => {
    const start_date = new Date(yesterday_ts * 1000);
    start_date.setHours(0,0,0);
    return start_date.toISOString();
}

export const getEndDate = () => {
    const end_date = new Date(yesterday_ts * 1000);
    end_date.setHours(23,59,59);
    return end_date.toISOString();
}   
