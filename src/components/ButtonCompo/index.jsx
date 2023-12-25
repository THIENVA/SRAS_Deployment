import { Button } from '@mui/material'

const ButtonCompo = ({
    style,
    children,
    variant = 'contained',
    onClick,
    type = 'button',
    disable = false,
    fullWidth = false,
    size = 'medium',
}) => {
    return (
        <Button
            variant={variant}
            sx={{ px: 2, py: 1, borderRadius: 3, minWidth: 200, ...style }}
            onClick={onClick}
            type={type}
            disabled={disable}
            fullWidth={fullWidth}
            size={size}
        >
            {children}
        </Button>
    )
}

export default ButtonCompo
