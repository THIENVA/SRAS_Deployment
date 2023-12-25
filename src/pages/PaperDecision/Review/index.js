import React from 'react'

import { useHistory } from 'react-router-dom'

import { ArrowCircleRight, EditOutlined } from '@mui/icons-material'
import { Box, Button, Divider, Typography } from '@mui/material'

import ReviewChecklistCriteria from './ReviewChecklistCriteria'
import SectionLayout from './SectionLayout'
import TitleSection from './TitleSection'

import { AppStyles } from '~/constants/colors'
import Loading from '~/pages/Loading'

const Review = ({ loading, reviewers, conferenceId, generalInfo, handleGoBack, setIndex }) => {
    const history = useHistory()
    return (
        <React.Fragment>
            {loading ? (
                <Loading height="80vh" />
            ) : (
                <React.Fragment>
                    {reviewers.map((reviewer, index) => (
                        <Box key={index}>
                            <TitleSection>
                                <Box display="flex" alignItems={'center'}>
                                    <Typography sx={{ fontWeight: 'bold' }}>
                                        Reviewer #{index + 1}{' '}
                                        {'(' +
                                            (reviewer.namePrefix ? reviewer.namePrefix + ' ' : '') +
                                            reviewer.firstName +
                                            ' ' +
                                            (reviewer.middleName ? reviewer.middleName : '') +
                                            ' ' +
                                            reviewer.lastName +
                                            ')'}
                                    </Typography>
                                    {reviewer.totalScore && (
                                        <React.Fragment>
                                            <React.Fragment>
                                                <Box display="flex" justifyContent="center" ml={2}>
                                                    <Divider
                                                        orientation="vertical"
                                                        sx={{
                                                            height: 30,
                                                            backgroundColor: AppStyles.colors['#F7F7F7'],
                                                            opacity: 0.5,
                                                            mr: 1,
                                                        }}
                                                    />
                                                </Box>
                                                <Button
                                                    variant="text"
                                                    sx={{
                                                        color: AppStyles.colors['#F7F7F7'],
                                                        textTransform: 'none',
                                                    }}
                                                    startIcon={<EditOutlined />}
                                                    onClick={() =>
                                                        history.push(
                                                            `/conferences/${conferenceId}/track/${generalInfo.trackId}/paper/${generalInfo.paperId}/edit-reviewer-reviews/${reviewer.review}`
                                                        )
                                                    }
                                                >
                                                    Edit Review
                                                </Button>
                                            </React.Fragment>
                                        </React.Fragment>
                                    )}
                                </Box>
                            </TitleSection>
                            <Box ml={1}>
                                {reviewer.totalScore ? (
                                    <React.Fragment>
                                        <SectionLayout
                                            title={'Research Paper Review Criteria'}
                                            titleStyle={{ textTransform: 'uppercase', fontWeight: 600 }}
                                        >
                                            <Box>
                                                {reviewer.reviewCriteriaResult !== null && (
                                                    <ReviewChecklistCriteria
                                                        criteria={
                                                            reviewer.reviewCriteriaResult
                                                                ? JSON.parse(reviewer.reviewCriteriaResult)
                                                                : []
                                                        }
                                                    />
                                                )}
                                            </Box>
                                            <Box
                                                mb={1}
                                                display="flex"
                                                alignItems={'center'}
                                                justifyContent="flex-end"
                                                mr={2}
                                            >
                                                <Typography
                                                    align="right"
                                                    sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}
                                                >
                                                    Average Evaluation score (Average Score of Above Criteria):
                                                </Typography>
                                                {reviewer.totalScore && (
                                                    <Typography ml={1} sx={{ fontSize: 16 }}>
                                                        {reviewer.totalScore}/100
                                                    </Typography>
                                                )}
                                            </Box>
                                        </SectionLayout>
                                        <SectionLayout
                                            title={'Details Research Paper Review Criteria'}
                                            titleStyle={{ textTransform: 'uppercase', fontWeight: 600 }}
                                        >
                                            <Box ml={2} mb={1} alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}>
                                                    Suggestions for Chair:
                                                </Typography>
                                                {reviewer.suggestionsForChair && (
                                                    <Box
                                                        sx={{
                                                            mt: 1,
                                                            backgroundColor: AppStyles.colors['#F5F5F5'],
                                                            border: '1px solid #002b5d',
                                                            p: 1,
                                                            borderRadius: 1,
                                                            // maxWidth: 600,
                                                        }}
                                                    >
                                                        <Typography
                                                            component={'pre'}
                                                            sx={{
                                                                fontSize: 14,
                                                                color: AppStyles.colors['#000F33'],
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            {reviewer.suggestionsForChair}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                            <Box ml={2} mb={1} alignItems={'center'}>
                                                <Typography sx={{ fontSize: 14, fontWeight: 'bold', minWidth: 110 }}>
                                                    Comments for Authors:
                                                </Typography>
                                                {reviewer.commentsForAuthors && (
                                                    <Box
                                                        sx={{
                                                            mt: 1,
                                                            backgroundColor: AppStyles.colors['#F5F5F5'],
                                                            border: '1px solid #002b5d',
                                                            p: 1,
                                                            borderRadius: 1,
                                                            // maxWidth: 600,
                                                        }}
                                                    >
                                                        <Typography
                                                            component={'pre'}
                                                            sx={{
                                                                fontSize: 14,
                                                                color: AppStyles.colors['#000F33'],
                                                                whiteSpace: 'pre-wrap',
                                                                fontFamily: 'monospace',
                                                            }}
                                                        >
                                                            {reviewer.commentsForAuthors}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </SectionLayout>
                                    </React.Fragment>
                                ) : (
                                    <Typography sx={{ fontStyle: 'italic' }}>Reviewer has not review.</Typography>
                                )}
                            </Box>
                        </Box>
                    ))}
                    <Box
                        sx={{
                            mt: 4,
                            px: 2,
                            py: 2,
                            boxShadow: 'inset 0 -1px 0 #edeeef',
                            backgroundColor: AppStyles.colors['#F5F5F5'],
                            display: 'flex',
                        }}
                    >
                        <Box ml={6}>
                            <Button
                                color="error"
                                variant="contained"
                                sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                                onClick={() => handleGoBack()}
                            >
                                Go Back
                            </Button>
                        </Box>
                        <Box ml={4}>
                            <Button
                                sx={{ textTransform: 'none', height: 36, fontWeight: 'bold' }}
                                variant="contained"
                                onClick={() => setIndex('1')}
                                endIcon={<ArrowCircleRight />}
                            >
                                Go to Decision
                            </Button>
                        </Box>
                    </Box>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default Review
