import { forwardRef, useState } from 'react'

import { TextField } from '@mui/material'

const FactorDisqualifyingPaper = forwardRef((_, ref) => {
    const [factor, setFactor] = useState(ref.current)

    const handleFactorChange = (event) => {
        setFactor(event.target.value)
        ref.current = event.target.value
    }

    return (
        <TextField
            value={factor}
            onChange={handleFactorChange}
            size="small"
            multiline
            minRows={5}
            fullWidth
            maxRows={9}
            sx={{ pt: 2 }}
        />
    )
})

export default FactorDisqualifyingPaper
