import { Card, CardContent } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const CardCompo = ({ children, cardStyle, cardContentStyle }) => {
    return (
        <Card
            sx={{
                backgroundColor: AppStyles.colors['#FAFBFF'],
                ...cardStyle,
            }}
        >
            <CardContent sx={{ ...cardContentStyle }}>{children}</CardContent>
        </Card>
    )
}

export default CardCompo
