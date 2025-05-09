import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  useTheme,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import ProfileSettings from "./ProfileSettings";
import SecuritySettings from "./SecuritySettings";
// @ts-ignore - Import JS component
import NotificationSettings from "./NotificationSettings.jsx";
import { useAuth } from "../../contexts/AuthContext";

const MotionPaper = motion(Paper);

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `settings-tab-${index}`,
    "aria-controls": `settings-tabpanel-${index}`,
  };
}

const Settings: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const { user } = useAuth();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">
          User information not available. Please log in again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4, fontWeight: "bold" }}>
        Account Settings
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{ borderRadius: 2 }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="settings tabs"
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab label="Profile" {...a11yProps(0)} />
                <Tab label="Security" {...a11yProps(1)} />
                <Tab label="Notifications" {...a11yProps(2)} />
              </Tabs>
            </Box>
            <Box sx={{ px: 3 }}>
              <TabPanel value={tabValue} index={0}>
                <ProfileSettings />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <SecuritySettings />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <NotificationSettings />
              </TabPanel>
            </Box>
          </MotionPaper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;