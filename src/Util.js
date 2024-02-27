export const convert24TimeTo12 = (time) => {
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
        time = time.slice(1);
        time[5] = +time[0] < 12 ? ' am' : ' pm';
        time[0] = +time[0] % 12 || 12;
    }
    return time.join('');
};


export const convert12TimeTo24 = (time) => {
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    let AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM === "pm" && hours < 12) hours = hours + 12;
    if (AMPM === "am" && hours === 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    return `${sHours}:${sMinutes}:00`;
};

export const isTransporter = () => {
    return localStorage.getItem("UserType") === "transporter";
};

export const isTransporterMaster = () => {
    return localStorage.getItem("IsTransporterMaster") === "true";
};

export const isTeamMember = () => {
    return localStorage.getItem("IsTeamMember") === "true";
};

export const isFoodClient = () => {
    return localStorage.getItem("IsFoodClient") === "true";
};