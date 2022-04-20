"use strict";
const io = require('@actions/io');
const fs = require('fs');
let rawData = fs.readFileSync('contentful-export-yqiccqy-master.json');
let exportData = JSON.parse(rawData);
const localesToRemove = ['es-ES', 'de-DE', 'it-IT', 'nl-NL', 'fr-FR', 'pt-PT'];
function cleanData(data, deleteKeys) {
    // There is nothing to be done if `data` is not an object,
    // but for example "user01" or "MALE".
    if (typeof data != 'object')
        return;
    if (!data)
        return; // null object
    for (const key in data) {
        if (deleteKeys.includes(key)) {
            delete data[key];
        }
        else {
            // If the key is not deleted from the current `data` object,
            // the value should be check for black-listed keys.
            cleanData(data[key], localesToRemove);
        }
    }
}
cleanData(exportData, localesToRemove);
fs.writeFileSync('contentful-export-yqiccqy-master-2.json', JSON.stringify(exportData));
