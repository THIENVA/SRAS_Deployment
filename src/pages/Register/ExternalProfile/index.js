import { Box, Link, TextField } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const ExternalProfile = ({ externalProfile, handleExternalProfileChange }) => {
    return (
        <Box mt={3}>
            <Box
                sx={{
                    borderRadius: '6px 6px 0px 0px',
                    p: 2,
                    fontWeight: 'bold',
                    fontSize: 20,
                    backgroundColor: '#eeeeee',
                }}
            >
                External Profile Information
            </Box>
            <Box sx={{ borderRadius: '0px 0px 6px 6px', p: 2, backgroundColor: '#f9f9f9', pb: 3 }}>
                <Box mb={1}>
                    <Link
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: 18,
                        }}
                        underline="none"
                        href="https://en.wikipedia.org/wiki/Template:Google_Scholar_ID"
                    >
                        Google Scholar Id
                    </Link>
                </Box>
                <TextField
                    fullWidth
                    placeholder="Google Scholar Id..."
                    variant="outlined"
                    name="googleScholar"
                    value={externalProfile.googleScholar}
                    onChange={handleExternalProfileChange}
                    size="small"
                />
                <Box mb={1} mt={2}>
                    <Link
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',

                            fontSize: 18,
                        }}
                        underline="none"
                        href="https://www.wikidata.org/wiki/Property_talk:P4012"
                    >
                        Semantic Scholar Id
                    </Link>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Semantic Scholar Id..."
                    name="semanticScholar"
                    value={externalProfile.semanticScholar}
                    onChange={handleExternalProfileChange}
                    size="small"
                />
                <Box mb={1} mt={2}>
                    <Link
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: 18,
                        }}
                        underline="none"
                        href="https://dblp.org/"
                    >
                        DBLP Id
                    </Link>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="DBLP Id..."
                    name="dplp"
                    value={externalProfile.dplp}
                    onChange={handleExternalProfileChange}
                    size="small"
                />
                <Box mb={1} mt={2}>
                    <Link
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: 18,
                        }}
                        underline="none"
                        href="https://support.orcid.org/hc/en-us/sections/360001495313-What-is-ORCID"
                    >
                        ORCID Id
                    </Link>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="ORCID Id..."
                    name="orcid"
                    value={externalProfile.orcid}
                    onChange={handleExternalProfileChange}
                    size="small"
                />
                <Box mb={1} mt={2}>
                    <Link
                        sx={{
                            color: AppStyles.colors['#027A9D'],
                            cursor: 'pointer',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: 18,
                        }}
                        underline="none"
                        href="https://docs.openreview.net/getting-started/creating-an-openreview-profile/finding-your-profile-id"
                    >
                        OpenReview Id
                    </Link>
                </Box>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="OpenReview Id..."
                    name="openReview"
                    value={externalProfile.openReview}
                    onChange={handleExternalProfileChange}
                    size="small"
                />
            </Box>
        </Box>
    )
}

export default ExternalProfile
