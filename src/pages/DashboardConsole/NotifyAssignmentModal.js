import React from 'react'

import { Grid } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import ListItem from './UserInfoModal/ListItem'

import { AppStyles } from '~/constants/colors'

const NotifyAssignmentModal = ({ open, handleClose, row, handleSubmit, isCheck }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Notify Assignment?'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
            enableActions={true}
            cancelBtnName="No"
            submitBtnName="Yes"
            handleSubmit={() => handleSubmit(isCheck, row)}
        >
            <Grid container spacing={2}>
                <ListItem
                    itemName="Name"
                    value={row?.firstName + ' ' + row?.lastName}
                    itemWidth={3}
                    valueWidth={9}
                    outerStyle={{ boxShadow: 'none' }}
                />
                <ListItem
                    itemName="Email"
                    value={row?.email}
                    itemWidth={3}
                    valueWidth={9}
                    outerStyle={{ boxShadow: 'none' }}
                />
            </Grid>
        </ModalInfo>
    )
}

export default NotifyAssignmentModal
