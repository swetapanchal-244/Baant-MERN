// datetime-local input ko "YYYY-MM-DDTHH:mm" local format chahiye
export function toLocalInput(date) {
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function addHours(hours) {
    return new Date(Date.now() + hours * 60 * 60 * 1000);
}