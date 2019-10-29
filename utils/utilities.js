export function emptyStringsToNull(object) {
    for (var key in object) {
        if (object[key] === '') {
            object[key] = null;
        }
    }

    return object;
}