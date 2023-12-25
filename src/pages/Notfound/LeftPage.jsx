import React from 'react'

import { useHistory } from 'react-router-dom'

import { Typography } from '@mui/material'
import ButtonCompo from '~/components/ButtonCompo'

import { AppStyles } from '~/constants/colors'

const LeftPage = ({ status }) => {
    const history = useHistory()
    return (
        <React.Fragment>
            <Typography variant="h1" sx={{ color: AppStyles.colors['#000F33'] }} fontWeight={800} align="center">
                {status}
            </Typography>
            <Typography sx={{ textTransform: 'capitalize' }} align="center">
                {status === '404'
                    ? `THE PAGE YOU REQUESTED COULD NOT FOUND.
`
                    : `You can not access this page.`}
            </Typography>
            <ButtonCompo
                style={{ mt: 2, backgroundColor: AppStyles.colors['#004DFF'] }}
                onClick={() => history.push('/')}
            >
                Back To Home
            </ButtonCompo>
        </React.Fragment>
    )
}

export default LeftPage
