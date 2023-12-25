import { Grid } from '@mui/material'

import AvgReviewer from './AvgReviewer'
import AvgReviews from './AvgReviews'

const Reviews = ({ tableData }) => {
    return (
        <Grid container columnSpacing={4}>
            <Grid item xs={6} md={6} lg={6}>
                <AvgReviewer tableData={tableData} />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
                <AvgReviews tableData={tableData} />
            </Grid>
        </Grid>
    )
}

export default Reviews
