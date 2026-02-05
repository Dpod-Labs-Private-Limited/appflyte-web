const getMainStyles = (theme) => ({

    textField: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: 'black',
            '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ccc',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #000000',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #1976d2',
            },
            '&.Mui-active .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #1976d2',
            },
        },
    },

    selectField: {
        '&:hover': {
            '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #000000 !important',
            },
        },
        '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #1976d2 !important',
            },
        },
        '&.Mui-disabled': {
            backgroundColor: '#f5f5f5',
            opacity: 0.7,
        },
    },

    autocomplete: {
        '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            backgroundColor: '#FFFFFF',
            color: 'black',
            '& .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #ccc',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                border: '1px solid #000000',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #1976d2',
            },
            '&.Mui-active .MuiOutlinedInput-notchedOutline': {
                border: '2px solid #1976d2',
            },
        },
    },
    checkbox: {
        color: '#000000',
        borderRadius: '4px',
        '&.Mui-checked': {
            color: '#1976d2',
        },
        '&.Mui-disabled': {
            color: '#ccc',
            backgroundColor: '#f5f5f5',
        },
    },
    activateTab: {
        '& .MuiTabs-indicator': { backgroundColor: '#0B51C5', height: '2px' },
        '& .Mui-selected': {
            color: '#000000',
            backgroundColor: '#F0F0F0'
        },
    },
    tabs: {
        textTransform: 'capitalize',
        '&.Mui-selected': {
            color: '#000000'
        }
    }

});

export default getMainStyles;
