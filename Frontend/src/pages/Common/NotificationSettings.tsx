import React, { useState } from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from "@mui/material";
import {
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Assignment as AssignmentIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";

const NotificationSettings: React.FC = () => {
  const { user } = useAuth();
  const isHod = user?.role === "hod";
  
  // In a real app, these would come from an API and be persisted
  // For now, we'll just use local state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    
    // Email notification types
    orderStatusEmail: true,
    approvalRequestsEmail: isHod,
    orderCreatedEmail: !isHod,
    
    // In-app notification types
    orderStatusApp: true,
    approvalRequestsApp: isHod,
    orderCreatedApp: !isHod,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSave = () => {
    // This would call an API to save notification preferences
    // For now, we'll just show a console message
    console.log("Saving notification settings:", settings);
    // In a real app, you would implement an API call here
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Notification Preferences
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Configure how you want to receive notifications
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Notification Channels
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={handleChange}
                    name="emailNotifications"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <EmailIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography>Email Notifications</Typography>
                  </Box>
                }
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.browserNotifications}
                    onChange={handleChange}
                    name="browserNotifications"
                    color="primary"
                  />
                }
                label={
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <NotificationsIcon sx={{ mr: 1 }} fontSize="small" />
                    <Typography>Browser Notifications</Typography>
                  </Box>
                }
              />
            </FormGroup>
          </Paper>
        </Grid>

        {settings.emailNotifications && (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Email Notification Types
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ShoppingCartIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Order Status Updates" />
                  <Switch
                    checked={settings.orderStatusEmail}
                    onChange={handleChange}
                    name="orderStatusEmail"
                    color="primary"
                  />
                </ListItem>
                
                {isHod ? (
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AssignmentIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="New Approval Requests" />
                    <Switch
                      checked={settings.approvalRequestsEmail}
                      onChange={handleChange}
                      name="approvalRequestsEmail"
                      color="primary"
                    />
                  </ListItem>
                ) : (
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Order Creation Confirmations" />
                    <Switch
                      checked={settings.orderCreatedEmail}
                      onChange={handleChange}
                      name="orderCreatedEmail"
                      color="primary"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        )}

        {settings.browserNotifications && (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, bgcolor: "background.default" }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                In-App Notification Types
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <ShoppingCartIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Order Status Updates" />
                  <Switch
                    checked={settings.orderStatusApp}
                    onChange={handleChange}
                    name="orderStatusApp"
                    color="primary"
                  />
                </ListItem>
                
                {isHod ? (
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <AssignmentIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="New Approval Requests" />
                    <Switch
                      checked={settings.approvalRequestsApp}
                      onChange={handleChange}
                      name="approvalRequestsApp"
                      color="primary"
                    />
                  </ListItem>
                ) : (
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <CheckIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Order Creation Confirmations" />
                    <Switch
                      checked={settings.orderCreatedApp}
                      onChange={handleChange}
                      name="orderCreatedApp"
                      color="primary"
                    />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>
        )}

        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ minWidth: 150 }}
            >
              Save Preferences
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NotificationSettings;