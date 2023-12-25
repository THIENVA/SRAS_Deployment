import { Box, Divider, Grid, Tooltip, Typography, Zoom } from '@mui/material'

import { AppStyles } from '~/constants/colors'

const RegistrationItems = ({ data }) => {
    return (
        <Box>
            <Box my={1} sx={{}}>
                <Grid container columnSpacing={4} alignItems="center">
                    <Grid item md={5} lg={5}>
                        <Typography
                            sx={{ fontSize: 18, fontWeight: 600, color: AppStyles.colors['#333333'] }}
                        ></Typography>
                    </Grid>
                    <Grid item md={3} lg={3} display="flex">
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                            Authors
                        </Typography>
                    </Grid>
                    <Grid item md={2} lg={2} display="flex" justifyContent={'flex-end'}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                            Number of Pages
                        </Typography>
                    </Grid>
                    <Grid item md={2} lg={2} display="flex" justifyContent={'flex-end'}>
                        <Typography sx={{ fontSize: 16, fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                            Number of Extra Pages
                        </Typography>
                    </Grid>
                </Grid>
                <Box display="flex" justifyContent="center">
                    <Divider
                        sx={{
                            width: '100%',
                            height: 1,
                            mt: 1,
                            backgroundColor: AppStyles.colors['#444B52'],
                            opacity: 0.5,
                        }}
                    />
                </Box>
            </Box>
            <Box>
                {data
                    ? data?.map((value, index) => (
                          <Box key={index} mt={1}>
                              <Grid container columnSpacing={4}>
                                  <Grid item md={5} lg={5}>
                                      <Typography
                                          sx={{
                                              fontSize: 18,
                                              fontWeight: 600,
                                              color: AppStyles.colors['#0D1B3EB3'],
                                          }}
                                      >
                                          {value?.title}
                                      </Typography>
                                      <Typography
                                          textAlign="left"
                                          sx={{ fontSize: 14, color: AppStyles.colors['#0D1B3EB3'] }}
                                      >
                                          <b>Paper ID:</b> {value?.submissionId}
                                      </Typography>
                                  </Grid>
                                  <Grid
                                      item
                                      md={3}
                                      lg={3}
                                      display="flex"
                                      alignItems={'center'}
                                      //   justifyContent={'flex-end'}
                                  >
                                      <Box>
                                          {value?.authors?.map((value, index) => {
                                              let title = ''
                                              if (value?.isCorrespondingAuthor) {
                                                  title += 'Corresponding Author'
                                              }
                                              if (value?.isFirstAuthor) {
                                                  if (title.length > 0) {
                                                      title += ' | '
                                                  }
                                                  title += 'First Author'
                                              }
                                              if (value?.isPrimaryContact) {
                                                  if (title.length > 0) {
                                                      title += ' | '
                                                  }
                                                  title += 'Primary Contact'
                                              }
                                              return (
                                                  <Box key={index}>
                                                      <Box>
                                                          <Box display="flex" alignItems="center">
                                                              <Tooltip
                                                                  TransitionComponent={Zoom}
                                                                  title={title}
                                                                  placement="left"
                                                              >
                                                                  <Typography>
                                                                      <strong>
                                                                          {value.authorNamePrefix}{' '}
                                                                          {value.authorFullName}
                                                                      </strong>{' '}
                                                                      {value.authorEmail &&
                                                                          ' (' + value.authorEmail + ')'}
                                                                  </Typography>
                                                              </Tooltip>
                                                          </Box>
                                                          {value.authorOrganization && (
                                                              <Typography
                                                                  textAlign="left"
                                                                  sx={{
                                                                      fontSize: 14,
                                                                      color: AppStyles.colors['#0D1B3EB3'],
                                                                  }}
                                                              >
                                                                  <b>Organization:</b> {value.authorOrganization}
                                                              </Typography>
                                                          )}
                                                      </Box>
                                                  </Box>
                                              )
                                          })}
                                          {/* <Typography
                                          textAlign={'right'}
                                          sx={{
                                              fontSize: 18,
                                              fontWeight: 'bold',
                                              color: AppStyles.colors['#0D1B3EB3'],
                                          }}
                                      >
                                          {value?.numberOfPages}
                                      </Typography> */}
                                      </Box>
                                  </Grid>
                                  <Grid
                                      item
                                      md={2}
                                      lg={2}
                                      display="flex"
                                      alignItems={'center'}
                                      justifyContent={'flex-end'}
                                  >
                                      <Typography
                                          textAlign={'right'}
                                          sx={{
                                              fontSize: 18,
                                              fontWeight: 'bold',
                                              color: AppStyles.colors['#0D1B3EB3'],
                                          }}
                                      >
                                          {value?.numberOfPages}
                                      </Typography>
                                  </Grid>
                                  <Grid
                                      item
                                      md={2}
                                      lg={2}
                                      display="flex"
                                      alignItems={'center'}
                                      justifyContent={'flex-end'}
                                  >
                                      <Typography
                                          sx={{
                                              fontSize: 18,
                                              fontWeight: 'bold',
                                              color: AppStyles.colors['#0D1B3EB3'],
                                          }}
                                      >
                                          {value?.numberOfExtraPages}
                                      </Typography>
                                  </Grid>
                              </Grid>
                              <Box display="flex" justifyContent="center">
                                  <Divider
                                      sx={{
                                          width: '100%',
                                          height: 1,
                                          mt: 1,
                                          backgroundColor: AppStyles.colors['#444B52'],
                                          opacity: 0.5,
                                      }}
                                  />
                              </Box>
                          </Box>
                      ))
                    : null}
            </Box>
        </Box>
    )
}

export default RegistrationItems
