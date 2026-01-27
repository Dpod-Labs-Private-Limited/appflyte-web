export const getUserRole = async (roles, partialKey) => {
    for (const role of roles) {
        const foundKey = Object.keys(role).find((key) => key.includes(partialKey));
        if (foundKey) {
            return role[foundKey];
        }
    }
    return null;
};