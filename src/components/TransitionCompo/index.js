import React from 'react'

import { Slide } from '@mui/material'

const TransitionCompo = React.forwardRef(function TransitionCompo(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

export default TransitionCompo
