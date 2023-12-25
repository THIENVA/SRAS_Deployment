import { memo } from 'react'

import { cloneDeep } from 'lodash'

import { FormControl, MenuItem, Select } from '@mui/material'
import InputField from '~/components/InputField'

import { maxLength } from '~/mock/SubmissionQuest'

const CommentSection = ({ showAs, setShowAs }) => {
    const handleLength = (event) => {
        const updatedShowAs = cloneDeep(showAs)
        updatedShowAs.result.value = event.target.value
        setShowAs(updatedShowAs)
    }

    return (
        <InputField
            boxStyle={{ mt: 2, display: 'flex', alignItems: 'center' }}
            text="Maximum Length"
            textStyle={{ fontSize: 16, minWidth: 150, textAlign: 'right', mr: 2 }}
        >
            <FormControl size="small" sx={{ maxWidth: 150 }} fullWidth>
                <Select
                    size="small"
                    value={showAs.result.value}
                    onChange={handleLength}
                    MenuProps={{
                        transformOrigin: { horizontal: 'left', vertical: 'top' },
                        anchorOrigin: { horizontal: 'right', vertical: 'top' },
                    }}
                >
                    {maxLength.map((length) => (
                        <MenuItem key={length} value={length}>
                            {length}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </InputField>
    )
}

export default memo(CommentSection)
