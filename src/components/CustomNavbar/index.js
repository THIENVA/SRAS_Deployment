import { NavLink } from 'react-router-dom'

import { Box } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CustomNavbar = ({ children, to, style }) => {
    return (
        <Box
            component={NavLink}
            to={to}
            sx={{
                textDecoration: 'none',
                color: AppStyles.colors['#F7F7F7'],
                position: 'relative',
                fontFamily: 'Roboto',
                p: 1.5,
                ':hover': {
                    color: AppStyles.colors['#1976D2'],
                    backgroundColor: AppStyles.colors['#F7F7F7'],
                    borderRadius: 1,
                },
                '&.active': {
                    color: AppStyles.colors['#1976D2'],
                    backgroundColor: AppStyles.colors['#F7F7F7'],
                    borderRadius: 1,
                },
                ...style,
            }}
            exact
        >
            {children}
        </Box>
    )
}

export default CustomNavbar
