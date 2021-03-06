export const addDashes = (string) => {
    if (string && string.length === 10 && string.match(/^[0-9]{10}$/u) !== null) {
        return (
            `${string.slice(0, 3)}-${string.slice(3, 6)}-${string.slice(6, 10)}`);
    }

    return "";

};
export const stringToColor = (string) => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let colour = "#";

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        colour += `00${value.toString(16)}`.substr(-2);
    }

    return colour;
};
