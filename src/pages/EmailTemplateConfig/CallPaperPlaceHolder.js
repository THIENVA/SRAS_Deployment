import { Fragment, useState } from 'react'

import { ArrowForwardIosSharp } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Grid, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import ListItemPopupInfo from '~/components/ListItemPopupInfo'

import callingForPapersPlaceHolder from '~/constants/call-paper-place-holder'
import { AppStyles } from '~/constants/colors'

const MuiAccordion = styled((props) => <Accordion disableGutters elevation={1} square {...props} />)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}))

const MuiAccordionSummary = styled((props) => (
    <AccordionSummary expandIcon={<ArrowForwardIosSharp sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}))

const MuiAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: theme.spacing(2),
}))

const CallPaperPlaceHolder = () => {
    const [accordionOpen, setAccordionOpen] = useState(false)

    return (
        <MuiAccordion expanded={accordionOpen}>
            <MuiAccordionSummary onClick={() => setAccordionOpen(!accordionOpen)}>
                <Typography>All Supported Placeholders</Typography>
            </MuiAccordionSummary>
            <MuiAccordionDetails>
                <Grid container spacing={2}>
                    {callingForPapersPlaceHolder.map((placeHolderGroup) => (
                        <Fragment key={placeHolderGroup.placeHolderGroupId}>
                            <Grid
                                item
                                xs={12}
                                sx={{
                                    backgroundColor: AppStyles.colors['#F8F9FA'],
                                    boxShadow: 'inset 0 -1px 0 #edeeef',
                                }}
                            >
                                <Typography sx={{ fontWeight: 600, fontSize: 18, color: AppStyles.colors['#464646'] }}>
                                    {placeHolderGroup.placeHolderGroupName}
                                </Typography>
                            </Grid>
                            {placeHolderGroup.supportedPlaceholders.map((supportedPlaceHolder) => (
                                <ListItemPopupInfo
                                    key={supportedPlaceHolder.id}
                                    itemName={supportedPlaceHolder.encode}
                                    value={supportedPlaceHolder.description}
                                    itemWidth={6}
                                    valueWidth={6}
                                    itemNameTxtStyle={{ fontSize: 18, fontWeight: 500 }}
                                    valueTxtStyle={{ fontSize: 18 }}
                                />
                            ))}
                        </Fragment>
                    ))}
                </Grid>
            </MuiAccordionDetails>
        </MuiAccordion>
    )
}

export default CallPaperPlaceHolder
