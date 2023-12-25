import { Grid, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ListItem = ({
    itemName,
    value,
    outerWidthValue,
    itemWidth,
    valueWidth,
    itemNameTxtStyle,
    valueTxtStyle,
    outerStyle,
    onClick,
}) => {
    return (
        <Grid container item xs={outerWidthValue} sx={{ boxShadow: 'inset 0 -1px 0 #edeeef', ...outerStyle }}>
            <Grid item xs={itemWidth}>
                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#444B52'], ...itemNameTxtStyle }}>
                    {itemName}
                </Typography>
            </Grid>
            <Grid item xs={valueWidth}>
                <Typography onClick={onClick} sx={{ color: AppStyles.colors['#495057'], ...valueTxtStyle }}>
                    {value}
                </Typography>
            </Grid>
        </Grid>
    )
}

export default ListItem
