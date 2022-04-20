var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { promises as fs } from 'fs';
// import * as core from '@actions/core'
const core = require('@actions/core');
main().catch((error) => core.setFailed(error.message));
const readFile = (file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield fs.readFile(file, 'utf8');
    }
    catch (err) {
        console.log(err);
    }
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = core.getInput('path', { required: true });
            const localesToRemove = core.getInput('localesToRemove', { required: true });
            const localesToRemoveJSON = JSON.parse(localesToRemove);
            const file = readFile(filePath);
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
                        cleanData(data[key], localesToRemoveJSON);
                    }
                }
            }
            cleanData(file, localesToRemoveJSON);
            fs.writeFile('contentful-export-yqiccqy-master-2.json', JSON.stringify(file));
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
