export const mergeFunctionEventTypeData = async (function_data, event_types_data) => {
    return function_data?.length > 0 ? function_data.map((item) => {
        const functionEventTypes = item?.payload?.appflyte_event_types?.map((eventTypeId) => {
            const matchedEventType = event_types_data?.find((eventType) => eventType?.payload?.__auto_id__ === eventTypeId);
            return matchedEventType ? { ...matchedEventType?.payload } : {};
        }) || [];
        return { ...item?.payload, functionEventTypes };
    }) : [];
};


export const restructureEngineFunctions = async (merged_function_event_type_data) => {
    const functionsById = {};
    merged_function_event_type_data?.forEach(func => {
        if (func?.__auto_id__) {
            functionsById[func.__auto_id__] = { ...func, child_functions: [] };
        }
    });
    merged_function_event_type_data?.forEach(func => {
        const parentFunction = Array.isArray(func?.parent_function) ? func?.parent_function : [];
        parentFunction?.forEach(parentId => {
            if (functionsById[parentId]) {
                functionsById[parentId]?.child_functions?.push(functionsById[func.__auto_id__]);
            }
        });
    });
    return Object.values(functionsById)?.filter(func => !func?.parent_function?.length);
}

export const mergeEngineFunctionData = async (engine_data, function_data) => {
    return engine_data?.length > 0 ? engine_data?.map((item) => {
        const engineFunctions = item?.payload?.appflyte_functions?.map((funcId) => {
            return function_data?.find((func) => func?.__auto_id__ === funcId) || []
        }) || []
        return { ...item?.payload, engineFunctions };
    }) : []
};

export const getUserRoleId = async (userRoleData, userRoleType) => {
    const filteredData = userRoleData?.filter((item) => item?.payload?.name === userRoleType);
    const userRoleId = filteredData?.length > 0 ? filteredData.map((item) => item.payload?.__auto_id__)[filteredData.length - 1] : null;
    return userRoleId
}

export const transformEngineData = async (data) => {
    return data?.engineFunctions?.length > 0 ? data?.engineFunctions?.filter(item => item?.__auto_id__ && item?.name).map((item) => ({
        id: item?.__auto_id__,
        name: item?.name,
        description: item?.description,

        functionEvents: item?.functionEventTypes?.length > 0 ? item?.functionEventTypes?.filter(subitem => subitem?.__auto_id__ && subitem?.name).map((subitem) => ({
            id: subitem?.__auto_id__,
            name: subitem?.name,
            description: subitem?.description,
        })) : [],

        subFunctions: item?.child_functions?.length > 0 ? item?.child_functions?.filter(subitem => subitem?.__auto_id__ && subitem?.name).map((subitem) => ({
            id: subitem?.__auto_id__,
            name: subitem?.name,
            description: subitem?.description,

            subFunctionEvents: subitem?.functionEventTypes?.length > 0 ? subitem?.functionEventTypes?.filter(subsubitem => subsubitem?.__auto_id__ && subsubitem?.name).map((subsubitem) => ({
                id: subsubitem?.__auto_id__,
                name: subsubitem?.name,
                description: subsubitem?.description,
            })) : [],

        })) : []
    })) : []
};
