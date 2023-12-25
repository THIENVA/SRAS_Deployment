import React, { useState } from 'react'

import { Cancel, Edit } from '@mui/icons-material'
import { Box, Button, IconButton, TextField, Typography } from '@mui/material'
import CardCompo from '~/components/Card'

import { AppStyles } from '~/constants/colors'

const SubNavBar = React.forwardRef(({ childs, parentIndex, modifySubNavHandler, deleteSubNav, parentId }, ref) => {
    const [isAdd, setIsAdd] = useState({ status: true, id: null })
    const [text, setText] = useState('')

    const openEditSubNavHandler = (id) => {
        const subNavItem = childs.find((item) => item.childId === id)
        setIsAdd({ status: false, id })
        setText(subNavItem.childLabel)
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }

    const openAddSubNav = () => {
        setText('')
        setIsAdd({ status: true, id: null })
    }

    const handleTextChange = (event) => {
        setText(event.target.value)
    }

    const handleAddingSubNav = () => {
        modifySubNavHandler(text, parentIndex, parentId, isAdd)
        setText('')
        setIsAdd({ status: true, id: null })
    }

    const handleDeletingSubNav = (childId, childIndex) => {
        deleteSubNav(parentIndex, childId, childIndex)
        if (isAdd.id === childId) {
            setText('')
            setIsAdd({ status: true, id: null })
        }
    }

    return (
        <React.Fragment>
            <Box sx={{ position: 'relative', ml: 3 }}>
                <Box sx={{ height: '0.5px' }}></Box>
                {childs.map((child, index) => (
                    <Box
                        key={child.childId}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 3,
                            '&:before': {
                                content: '""',
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                height: 24 * (index + 1) + 28 * (index * 2 + 1),
                                width: '1px',
                                backgroundColor: AppStyles.colors['#333333'],
                            },
                        }}
                    >
                        <Box sx={{ height: '1px', width: 48, backgroundColor: AppStyles.colors['#333333'] }}></Box>
                        <CardCompo
                            cardStyle={{ width: 'fit-content' }}
                            cardContentStyle={{
                                px: 2,
                                py: '8px !important',
                                backgroundColor: (theme) =>
                                    `${
                                        isAdd.id === child.childId
                                            ? theme.palette.primary.main
                                            : AppStyles.colors['#FAFBFF']
                                    }`,
                                color: `${
                                    isAdd.id === child.childId
                                        ? AppStyles.colors['#FAFBFF']
                                        : AppStyles.colors['#000000de']
                                }`,
                            }}
                        >
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Typography variant="h6">{child.childLabel.toUpperCase()}</Typography>
                                <Box sx={{ ml: 5 }} display="flex" alignItems="center">
                                    <IconButton onClick={() => openEditSubNavHandler(child.childId)}>
                                        <Edit
                                            sx={{
                                                color: `${
                                                    isAdd.id === child.childId
                                                        ? AppStyles.colors['#FAFBFF']
                                                        : AppStyles.colors['#000000de']
                                                }`,
                                            }}
                                        />
                                    </IconButton>
                                    <IconButton
                                        sx={{ mr: 1.5 }}
                                        onClick={() => handleDeletingSubNav(child.childId, index)}
                                    >
                                        <Cancel />
                                    </IconButton>
                                </Box>
                            </Box>
                        </CardCompo>
                    </Box>
                ))}
            </Box>
            <Box
                ref={ref}
                display="flex"
                mt={2}
                ml={3}
                sx={{
                    boxShadow: 'rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px',
                    py: 1.5,
                    px: 3,
                    width: 'fit-content',
                    backgroundColor: '#F9F9F9',
                }}
            >
                <TextField placeholder="Sub navbar name" size="small" value={text} onChange={handleTextChange} />
                <Button onClick={handleAddingSubNav} size="small" variant="contained" sx={{ mx: 2 }}>
                    {isAdd.status === true ? 'Add' : 'Edit'} Sub Navbar
                </Button>
                {!isAdd.status && (
                    <Button onClick={openAddSubNav} size="small" variant="outlined" color="error">
                        Cancel Editing Sub Navbar
                    </Button>
                )}
            </Box>
        </React.Fragment>
    )
})

export default SubNavBar
