import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material'

const SelectCompo = ({
    value,
    onChange,
    size = 'medium',
    multiple = false,
    values = [],
    fromStyle,
    selectStyle,
    name,
    width,
    isShowNone = false,
}) => {
    return (
        <Box sx={{ width: width }}>
            <FormControl fullWidth sx={{ ...fromStyle }}>
                <InputLabel id="demo-simple-select-label">{name}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={value}
                    label={name}
                    onChange={onChange}
                    multiple={multiple}
                    size={size}
                    sx={{ ...selectStyle }}
                >
                    {isShowNone && (
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                    )}
                    {values.map((item) => (
                        <MenuItem key={item.id} value={item.value}>
                            {item.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    )
}

export default SelectCompo
