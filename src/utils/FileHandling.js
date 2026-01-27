import { tostAlert } from "./AlertToast";

export const validateFileUpload = async (files, allowedExtensions) => {
    const blockedFiles = [];

    files.forEach(file => {
        const fileExtension = file?.name?.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            blockedFiles.push(file.name);
        }
    });

    return blockedFiles;
};

const checkRelamConfig = async (matchingFiles, realmSettings) => {

    let matchingRealmFiles = []

    for (let i = 0; i < matchingFiles?.length; i++) {

        if (typeof matchingFiles[i]?.realm !== 'object' || typeof realmSettings !== 'object') {
            continue;
        }

        const keys1 = Object.keys(matchingFiles[i]?.realm);
        const keys2 = Object.keys(realmSettings);

        if (keys1.length !== keys2.length) {
            continue;
        }

        let matchFound = true;

        for (let key of keys1) {
            if (!realmSettings.hasOwnProperty(key) || matchingFiles[i]?.realm[key] !== realmSettings[key]) {
                matchFound = false;
                break;
            }
        }

        if (matchFound) {
            matchingRealmFiles.push(matchingFiles[i])
        }
    }
    return matchingRealmFiles
}


export const fileRealmExcistenceCheck = async (existingfiles, selectedFiles, realmSettings) => {

    const matchingFiles = existingfiles?.filter(item1 => selectedFiles?.some(item2 => item1?.file_name === item2?.name))
    const realm_files = await checkRelamConfig(matchingFiles, realmSettings)

    // if (realm_files.length > 0) {
    //     if (realm_files.length === 1) {
    //         tostAlert("File Already Exist with the Realm", 'warning')
    //         return true
    //     }
    //     tostAlert(`Files:\n\n${realm_files.join('\n')}\n\n Already Exist In the Realm`, 'warning');
    //     return true
    // }
    return realm_files
}

export const fileExcistenceCheck = async (existingfiles, selectedFiles) => {
    const matchingFiles = existingfiles?.filter(item1 =>
        selectedFiles?.some(item2 => item1?.file_name === item2?.name)
    )?.map(item => item?.file_name)

    if (matchingFiles.length > 0) {
        if (matchingFiles.length === 1) {
            tostAlert(`File Already Exist:\n\n${matchingFiles.join('\n')}`, 'warning')
            return true
        }
        tostAlert(`Files Already Exist:\n\n${matchingFiles.join('\n')}`, 'warning');
        return true
    }
    return false
}

