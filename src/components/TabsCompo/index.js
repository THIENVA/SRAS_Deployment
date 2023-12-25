import { Tab, Tabs } from '@mui/material'

const TabsCompo = ({ value, handleChange, tabs }) => {
    return (
        <Tabs variant="scrollable" value={value} onChange={handleChange}>
            {tabs.map((tab, index) => (
                <Tab key={index} label={tab.label} />
            ))}
        </Tabs>
    )
}

export default TabsCompo
