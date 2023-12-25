import { Sync } from '@mui/icons-material'
import { Button } from '@mui/material'

const SyncComponent = ({ setSync, buttonStyle, variant = 'outlined' }) => {
    return (
        <Button
            type="button"
            startIcon={<Sync />}
            variant={variant}
            onClick={() => {
                setSync()
            }}
            sx={{ ml: 2, ...buttonStyle }}
        >
            Sync
        </Button>
    )
}

export default SyncComponent
