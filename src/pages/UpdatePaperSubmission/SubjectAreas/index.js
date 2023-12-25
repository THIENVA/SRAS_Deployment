import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, Typography } from '@mui/material'

import TitleSection from '../TitleSection'

import { AppStyles } from '~/constants/colors'

const SubjectAreas = ({ subjectAreas, handleSubjectAreas }) => {
    return (
        <Box mb={3}>
            <TitleSection>
                <Typography>
                    SUBJECT AREAS{' '}
                    <Box component="span" sx={{ fontSize: 12, color: 'red', verticalAlign: 'top' }}>
                        *
                    </Box>{' '}
                </Typography>
            </TitleSection>
            <Typography sx={{ my: 2, color: AppStyles.colors['#ffa500'] }} variant="body2" color="InfoText">
                You must select 1 Primary subject area.
            </Typography>
            <Box mt={2} sx={{ display: 'flex' }}>
                <FormControl sx={{ mr: 4 }} variant="standard">
                    <Typography fontWeight={700}>Primary</Typography>
                    <FormGroup>
                        {subjectAreas.map((subjectArea, index) => (
                            <FormControlLabel
                                key={subjectArea.id}
                                control={<Checkbox name={subjectArea.name} />}
                                label={subjectArea.name}
                                checked={subjectArea.primaryChecked === true}
                                onChange={(event) => handleSubjectAreas(event, subjectArea.id, 'primary', index)}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
                <FormControl variant="standard">
                    <Typography fontWeight={700}>Secondary</Typography>
                    <FormGroup>
                        {subjectAreas.map((subjectArea, index) => (
                            <FormControlLabel
                                key={subjectArea.id}
                                control={<Checkbox name={subjectArea.name} />}
                                label={subjectArea.name}
                                checked={subjectArea.secondaryChecked}
                                onChange={(event) => handleSubjectAreas(event, subjectArea.id, 'secondary', index)}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            </Box>
        </Box>
    )
}

export default SubjectAreas
