export const AlertMessages = async (operation, name = '') => {
    let msg = '';

    switch (operation) {
        case 'create':
            msg = `${name} created successfully!`;
            break;
        case 'update':
            msg = `${name} updated successfully!`;
            break;
        case 'delete':
            msg = `${name} deleted successfully!`;
            break;
        case 'error':
            msg = `There was an error with the ${name}. Please try again.`;
            break;
        case 'warning':
            msg = `Please Select ${name}. try again.`;
            break;
        default:
            msg = `Operation on ${name} was successful.`;
            break;
    }

    return msg;
};


