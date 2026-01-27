import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';

import { Box, CircularProgress, FormControl, TextField, Typography, Select, MenuItem } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import { useTheme } from '@mui/material/styles';
import { getComponentsStyles } from '../../../styles/componentsStyles';
import { Styles } from './styles';
import { fontStyles } from '../../../styles/fontStyles';

import { tostAlert } from '../../../utils/AlertToast';

import {
    mergeFunctionEventTypeData, restructureEngineFunctions,
    mergeEngineFunctionData, transformEngineData
} from "../../../utils/AgentApiToken/TokenUtilityService";
import { useAppContext } from '../../../context/AppContext';


function ServiceAccountPermission({ setDataLoading, loading, dataLoading, setTokenName, setPermissionType, setTokenPermissions,
    setTokenExpireTime, tokenName, appflyteEventTypes, appflyteFunctions, appflyteEngines, formErrors }) {

    const theme = useTheme();
    const componentsStyles = getComponentsStyles(theme);
    const { selectedProject } = useAppContext();

    //Token Expiraion
    const [selectedOption, setSelectedOption] = useState("");
    const [customDate, setCustomDate] = useState(() => moment().format("YYYY-MM-DD"));

    // Token Permissions
    const [engineDetails, setEngineDetails] = useState([]);
    const [functionRowSelection, setFunctionRowSelection] = useState({});
    const [functionEventRowSelection, setFunctionEventRowSelection] = useState({});
    const [subFunctionRowSelection, setSubFunctionRowSelection] = useState({});
    const [subFunctionEventRowSelection, setSubFunctionEventRowSelection] = useState({});

    const [mainFunctionChanged, setMainFunctionChanged] = useState(false);
    const [functionEventChanged, setFunctionEventChanged] = useState(false);
    const [subFunctionChanged, setSubFunctionChanged] = useState(false);
    const [subFunctionEventChanged, setSubFunctionEventChanged] = useState(false);

    const [totalEngineFunctions, setTotalEngineFunctions] = useState(0)

    useEffect(() => {
        const current_engine = selectedProject?.payload?.lookup_id?.[0] ?? null
        const filterd_Engines = (appflyteEngines?.length > 0 || current_engine) ? appflyteEngines?.filter((item) => item?.payload?.__auto_id__ === current_engine) : []
        filterd_Engines?.length > 0 && handleEngineDetails(filterd_Engines, appflyteFunctions, appflyteEventTypes)
        //eslint-disable-next-line
    }, [appflyteEventTypes, appflyteEngines, appflyteFunctions])

    const getTimeInSeconds = async (currentOption, customSelectedDate) => {
        const currentTimeInSeconds = moment().unix();
        const optionsInSeconds = {
            '1': moment().add(1, 'days').unix(),
            '30': moment().add(30, 'days').unix(),
            '60': moment().add(60, 'days').unix(),
            '90': moment().add(90, 'days').unix(),
            '1year': moment().add(1, 'years').unix(),
        };
        if (currentOption === 'custom' && customSelectedDate) {
            return moment(customSelectedDate).unix();
        }
        return optionsInSeconds[currentOption] || currentTimeInSeconds;
    };

    const handleExpireTimeSelection = async (e, type) => {
        const value = e.target.value;
        if (type === "custom" && moment(value).isBefore(moment(), "day")) {
            tostAlert("Cannot select a previous date", "warning");
            return;
        }
        setSelectedOption(type === "custom" ? type : value);
        if (type === "custom") {
            setCustomDate(value);
        }
        const timeSec = await getTimeInSeconds(value, type === "custom" ? value : null);
        setTokenExpireTime(timeSec);
    };

    const handleEngineDetails = async (engine_data, function_data, event_types_data) => {
        setDataLoading(true)
        try {
            const mergedFunctionEventTypeData = await mergeFunctionEventTypeData(function_data, event_types_data);
            const restructuredFunctionsData = await restructureEngineFunctions(mergedFunctionEventTypeData);
            const mergedEngineFunctionData = await mergeEngineFunctionData(engine_data, restructuredFunctionsData);
            const transformedEngineData = await transformEngineData(mergedEngineFunctionData?.[0] ?? [])
            if (transformedEngineData?.length > 0) {
                const total_engine_functions = transformedEngineData?.length ?? 0
                setTotalEngineFunctions(total_engine_functions)
                setEngineDetails(transformedEngineData);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading(false)
        }
    }

    const headerStyles = {
        backgroundColor: "#000000",
        color: "#FFFFFF",
    }

    const functionColumn = useMemo(() => [
        { accessorKey: 'name', header: 'Function Name' },
        { accessorKey: 'description', header: 'Function Descriptions' }
    ], []);

    const EventColumn = useMemo(() => [
        { accessorKey: 'name', header: 'Event Name' },
        { accessorKey: 'description', header: 'Event Descriptions' }
    ], [])

    const subFunctionColumn = useMemo(() => [
        { accessorKey: 'name', header: 'Event Name' },
        { accessorKey: 'description', header: 'Event Descriptions' }
    ], [])

    useEffect(() => {
        const combined = {
            ...functionRowSelection,
            ...functionEventRowSelection,
            ...subFunctionRowSelection,
            ...subFunctionEventRowSelection
        };
        const uniqueKeys = new Set(Object.keys(combined));
        const selectedData = Array.from(uniqueKeys);

        const permittedData = engineDetails?.length > 0 ? engineDetails?.filter(item => selectedData.includes(item?.id))?.map(item => ({
            id: item?.id,
            name: item?.name,
            event_types: item?.functionEvents?.length > 0 ? item?.functionEvents?.filter(subitem => selectedData.includes(subitem?.id))?.map(subitem => ({
                id: subitem?.id,
                name: subitem?.name,
            })) : [],
            sub_functions: item?.subFunctions?.length > 0 ? item?.subFunctions?.filter(subitem => selectedData.includes(subitem?.id))?.map(subitem => ({
                id: subitem?.id,
                name: subitem?.name,
                event_types: subitem?.subFunctionEvents?.length > 0 ? subitem?.subFunctionEvents?.filter(subsubitem => selectedData.includes(subsubitem?.id))?.map(subsubitem => ({
                    id: subsubitem?.id,
                    name: subsubitem?.name,
                })) : [],
            })) : []
        })) : [];
        setTokenPermissions(permittedData)
        const permission_type = totalEngineFunctions === permittedData?.length ? 'all' : 'restricted';
        setPermissionType(permission_type)
        // eslint-disable-next-line
    }, [functionRowSelection, functionEventRowSelection, subFunctionRowSelection, subFunctionEventRowSelection, engineDetails])

    // Function checkbox handling
    useEffect(() => {
        const handleMainFunctionSelection = () => {
            const findselectedFunctionDetails = (data, functions) => {
                const newFunctionEventSelection = {};
                const newSubFunctionSelection = {};
                const newSubFunctionEventSelection = {};
                data?.forEach(item => {
                    if (functions?.includes(item?.id)) {
                        if (item?.functionEvents && item.functionEvents.length > 0) {
                            item.functionEvents.forEach((item) => {
                                newFunctionEventSelection[item.id] = true;
                            })
                        }
                        if (item?.subFunctions && item?.subFunctions?.length > 0) {
                            item?.subFunctions?.forEach((item) => {
                                newSubFunctionSelection[item.id] = true;
                                if (item?.subFunctionEvents && item?.subFunctionEvents.length > 0) {
                                    item?.subFunctionEvents?.forEach((info) => {
                                        newSubFunctionEventSelection[info.id] = true;
                                    })
                                }
                            })
                        }
                    }
                });
                setFunctionEventRowSelection(newFunctionEventSelection)
                setSubFunctionRowSelection(newSubFunctionSelection)
                setSubFunctionEventRowSelection(newSubFunctionEventSelection)
                setMainFunctionChanged(false)
            }
            const selectedFunctions = Object.keys(functionRowSelection)
            if (selectedFunctions.length > 0) {
                findselectedFunctionDetails(engineDetails, selectedFunctions);
            }
            else {
                setFunctionEventRowSelection({});
                setSubFunctionRowSelection({});
                setSubFunctionEventRowSelection({})
                setMainFunctionChanged(false);
            }
        }
        mainFunctionChanged === true && handleMainFunctionSelection()
        // eslint-disable-next-line
    }, [mainFunctionChanged])

    // Function Event And SubFunction Checkbox Handling
    useEffect(() => {
        const handleFunctionItemSelection = () => {
            const find_functionevents_and_subfunctions = (data, functionEvents, subFunctions) => {
                const newFunctionSelection = {};
                const newSubFunctionEventSelection = {};

                data.forEach(item => {

                    const hasMatchingEvent = item?.functionEvents?.length > 0 && item?.functionEvents.some(event => functionEvents?.includes(event?.id));
                    const hasMatchingSubFunction = item.subFunctions?.length > 0 && item?.subFunctions.some(subFunction => subFunctions?.includes(subFunction?.id));

                    if (item?.functionEvents?.length > 0 && item?.subFunctions?.length > 0) {

                        if (hasMatchingEvent) {
                            newFunctionSelection[item.id] = true
                        }

                        if (hasMatchingSubFunction) {
                            item?.subFunctions.forEach(sub_function => {
                                if (subFunctions.includes(sub_function.id)) {
                                    newFunctionSelection[item.id] = true;
                                    sub_function.subFunctionEvents?.forEach(sub_function_event => {
                                        newSubFunctionEventSelection[sub_function_event.id] = true;
                                    });
                                }
                            });
                        }
                    }
                    else {
                        if (item.functionEvents?.length > 0 && hasMatchingEvent) {
                            newFunctionSelection[item.id] = true
                        }
                        if (item.subFunctions?.length > 0 && hasMatchingSubFunction) {
                            item?.subFunctions.forEach(sub_function => {
                                if (subFunctions.includes(sub_function.id)) {
                                    newFunctionSelection[item.id] = true;
                                    sub_function.subFunctionEvents?.forEach(dashboard => {
                                        newSubFunctionEventSelection[dashboard.id] = true;
                                    });
                                }
                            });
                        }
                    }
                });
                setFunctionRowSelection(newFunctionSelection)
                setSubFunctionEventRowSelection(newSubFunctionEventSelection)
                setFunctionEventChanged(false)
                setSubFunctionChanged(false)
            }

            const functionEventsData = Object.keys(functionEventRowSelection)
            const subFunctionsData = Object.keys(subFunctionRowSelection)
            const result = (functionEventsData.length > 0 || subFunctionsData.length > 0) ? find_functionevents_and_subfunctions(engineDetails, functionEventsData, subFunctionsData) : null;
            return result
        }
        (functionEventChanged === true || subFunctionChanged === true) && handleFunctionItemSelection()
        // eslint-disable-next-line
    }, [functionEventChanged, subFunctionChanged])

    // subFunction Event Changed
    useEffect(() => {
        const handleSubFunctionEventSelection = () => {

            const findSubFunctionsWithCheckedEvents = (data, idsToCheck) => {
                const result = new Set();
                data.forEach(item => {
                    if (item.subFunctions) {
                        item.subFunctions.forEach(sub_functions => {
                            const subFunctionEventIds = sub_functions.subFunctionEvents?.map(sub_func_event => sub_func_event?.id) || [];
                            if (subFunctionEventIds.length > 0 && subFunctionEventIds.every(subFunctionEventId => idsToCheck.includes(subFunctionEventId))) {
                                result.add(sub_functions.id);
                            }
                        });
                    }
                });
                return Array.from(result);
            };

            const subFunctionEventIds = Object.keys(subFunctionEventRowSelection)
            const result = subFunctionEventIds.length > 0 ? findSubFunctionsWithCheckedEvents(engineDetails, subFunctionEventIds) : null;
            if (result !== null) {
                const idsObject = result && result.length > 0 && result.reduce((acc, id) => {
                    acc[id] = true;
                    return acc;
                }, {});
                setSubFunctionRowSelection(idsObject)
                setSubFunctionEventChanged(false)
            }
        }
        subFunctionEventChanged === true && handleSubFunctionEventSelection()
        // eslint-disable-next-line
    }, [subFunctionEventChanged])

    const handleFunctionRowSelectionChange = (newRowSelection) => {
        setFunctionRowSelection(newRowSelection);
        setMainFunctionChanged(true)
    };

    const handleFunctionEventRowSelectionChange = (newRowSelection) => {
        setFunctionEventRowSelection(newRowSelection);
        setFunctionEventChanged(true)
    };

    const handleSubFunctionRowSelectionChange = (newRowSelection) => {
        setSubFunctionRowSelection(newRowSelection);
        setSubFunctionChanged(true)
    };

    const handleSubFunctionEventRowSelectionChange = (newRowSelection) => {
        setSubFunctionEventRowSelection(newRowSelection);
        setSubFunctionEventChanged(true)
    };

    const tableData = useMaterialReactTable({
        columns: functionColumn,
        data: engineDetails,
        enableExpanding: true,
        enableExpandAll: true,
        enableRowSelection: true,
        enableSelectAll: true,
        getRowId: (row) => row.id,
        onRowSelectionChange: handleFunctionRowSelectionChange,
        state: { rowSelection: functionRowSelection },
        muiDetailPanelProps: () => ({
            sx: (theme) => ({
                backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,210,244,0.1)' : 'rgba(0,0,0,0.1)',
            }),
        }),

        muiExpandButtonProps: ({ row, table }) => ({
            onClick: () => table?.setExpanded({ [row?.id]: !row?.getIsExpanded() }),
            sx: {
                transform: row?.getIsExpanded() ? 'rotate(180deg)' : 'rotate(-90deg)',
                transition: 'transform 0.2s',
            },
        }),

        muiTableHeadCellProps: {
            sx: headerStyles
        },

        muiSelectAllCheckboxProps: {
            sx: {
                color: "#FFFFFF",
                '&.Mui-checked': {
                    color: "#FFFFFF",
                },
            },
        },

        renderDetailPanel: ({ row }) => (
            <Box>
                <Box>
                    <Typography sx={{ ...fontStyles.mediumText, textAlign: 'center', marginBottom: '5px' }}>{row?.original?.name} Events</Typography>
                    <MaterialReactTable
                        columns={EventColumn}
                        data={row?.original?.functionEvents || []}
                        getRowId={(func_event) => func_event.id}
                        enableRowSelection={true}
                        enableSelectAll={true}
                        onRowSelectionChange={handleFunctionEventRowSelectionChange}
                        state={{ rowSelection: functionEventRowSelection }}
                        muiTableHeadCellProps={{ sx: headerStyles }}
                        muiSelectAllCheckboxProps={{
                            sx: {
                                color: "#FFFFFF",
                                '&.Mui-checked': {
                                    color: "#FFFFFF",
                                },
                            },
                        }}

                    />
                </Box>
                <Box marginTop={'10px'}>
                    <Typography sx={{ ...fontStyles.mediumText, textAlign: 'center', marginBottom: '5px' }}>{row?.original?.name} Sub Functions</Typography>
                    <MaterialReactTable
                        columns={subFunctionColumn}
                        data={row?.original?.subFunctions || []}
                        getRowId={(sub_func) => sub_func.id}
                        enableRowSelection={true}
                        enableSelectAll={true}
                        onRowSelectionChange={handleSubFunctionRowSelectionChange}
                        state={{ rowSelection: subFunctionRowSelection }}
                        muiTableHeadCellProps={{ sx: headerStyles }}
                        muiSelectAllCheckboxProps={{
                            sx: {
                                color: "#FFFFFF",
                                '&.Mui-checked': {
                                    color: "#FFFFFF",
                                },
                            },
                        }}
                        renderDetailPanel={({ row }) => (
                            <div>
                                <Typography sx={{ ...fontStyles.mediumText, textAlign: 'center', marginBottom: '5px' }}>{row?.original?.name} Events</Typography>
                                <MaterialReactTable
                                    columns={EventColumn}
                                    data={row?.original?.subFunctionEvents || []}
                                    getRowId={(suB_func_event) => suB_func_event.id}
                                    enableRowSelection={true}
                                    enableSelectAll={true}
                                    onRowSelectionChange={handleSubFunctionEventRowSelectionChange}
                                    state={{ rowSelection: subFunctionEventRowSelection }}
                                    muiTableHeadCellProps={{ sx: headerStyles }}
                                    muiSelectAllCheckboxProps={{
                                        sx: {
                                            color: "#FFFFFF",
                                            '&.Mui-checked': {
                                                color: "#FFFFFF",
                                            },
                                        },
                                    }}
                                />
                            </div>
                        )}
                    />
                </Box>
            </Box >
        ),
    });

    return (
        <Box sx={Styles.mainContainer}>

            <Box>
                <FormControl>
                    <Typography sx={{ ...fontStyles.smallText, marginBottom: '6px' }}>Name</Typography>
                    <TextField
                        id="token_name"
                        variant="outlined"
                        size='small'
                        sx={{ ...componentsStyles.textField, width: '600px' }}
                        value={tokenName}
                        onChange={(e) => setTokenName(e.target.value)}
                    />
                    {formErrors.tokenName && <Typography sx={fontStyles.formErrorText}>{formErrors.tokenName}</Typography>}
                </FormControl>
            </Box>

            <Box marginTop={'20px'} >
                <Typography sx={{ ...fontStyles.smallText, marginBottom: '6px' }}>Expiration</Typography>

                <Box display={'flex'} alignItems={'center'} alignSelf={'center'}>
                    <FormControl>
                        <Select
                            labelId="expiration-label"
                            id="expiration"
                            value={selectedOption}
                            onChange={(e) => handleExpireTimeSelection(e, 'fixed')}
                            size='small'
                            displayEmpty
                            sx={{ ...componentsStyles.selectField, width: '300px' }}
                        >
                            <MenuItem value="" disabled>Select a Date</MenuItem>
                            <MenuItem value="1">1 Day</MenuItem>
                            <MenuItem value="30">30 Days</MenuItem>
                            <MenuItem value="60">60 Days</MenuItem>
                            <MenuItem value="90">90 Days</MenuItem>
                            <MenuItem value="1year">1 Year</MenuItem>
                            <MenuItem value="custom">Custom</MenuItem>
                        </Select>
                    </FormControl>

                    {selectedOption === 'custom' && (
                        <TextField
                            id="custom-date"
                            variant="outlined"
                            type="date"
                            size="small"
                            style={{ width: "300px", backgroundColor: "#FFFFFF", marginLeft: "10px" }}
                            sx={{ ...componentsStyles.textField }}
                            value={customDate}
                            error={moment(customDate).isBefore(moment(), "day")}
                            helperText={moment(customDate).isBefore(moment(), "day") ? "Cannot select a previous date" : ""}
                            onChange={(e) => handleExpireTimeSelection(e, 'custom')}
                            min={moment().format("YYYY-MM-DD")}
                        />
                    )}
                </Box>
                {formErrors.tokenExpireTime && <Typography sx={fontStyles.formErrorText}>{formErrors.tokenExpireTime}</Typography>}
            </Box>

            <Box marginTop={'20px'} paddingBottom={'20px'}>
                <Typography sx={{ ...fontStyles.smallText, marginBottom: '6px' }}>Token Permissions</Typography>

                {(engineDetails.length === 0 && (loading || dataLoading)) ?
                    (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 250px)' }}>
                        <Box>
                            <CircularProgress sx={{ height: 10, '& .MuiLinearProgress-bar': { backgroundColor: '#3AB197' } }} />
                            <Typography fontSize={'15px'} fontWeight={'400'} marginTop={'10px'}>Loading...</Typography>
                        </Box>
                    </div>)
                    :
                    (engineDetails.length > 0) &&
                    (<Box>
                        <MaterialReactTable table={tableData} />
                    </Box>)
                }
                {!(loading || dataLoading) && engineDetails.length === 0 &&
                    (<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 450px)' }}>
                        <Typography fontSize={'15px'} fontWeight={'400'} marginTop={'10px'}> No records to display</Typography>
                    </div>)
                }
            </Box>

        </Box>
    )
}


export default ServiceAccountPermission;