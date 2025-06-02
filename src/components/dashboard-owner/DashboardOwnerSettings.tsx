import React, { useState } from 'react';
import styled from 'styled-components';
import { FaSave, FaUser, FaLock, FaBell, FaPalette, FaGlobe, FaInfo } from 'react-icons/fa';

const DashboardOwnerSettings: React.FC = () => {
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://i.pravatar.cc/150?u=admin'
  });
  
  // Platform settings
  const [platformSettings, setAppSettings] = useState({
    allowNewRegistrations: true,
    autoAssignBoosters: true,
    requireVerification: true,
    maxFileSizeUpload: 5, // In MB
    maxConcurrentOrders: 3,
    defaultCommissionRate: 70, // Percentage
    enableLiveChat: true,
    enableEmailNotifications: true,
    enablePushNotifications: false,
    maintenanceMode: false
  });
  
  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    orderUpdates: true,
    chatMessages: true,
    boosterStatusChanges: true,
    systemAlerts: true,
    marketingUpdates: false
  });
  
  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'dark',
    sidebarCollapsed: false,
    accentColor: '#3498db',
    fontSize: 'medium',
    enableAnimations: true
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePlatformToggle = (setting: string) => {
    setAppSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };
  
  const handlePlatformChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const numberFields = ['maxFileSizeUpload', 'maxConcurrentOrders', 'defaultCommissionRate'];
    
    if (numberFields.includes(name)) {
      setAppSettings(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setAppSettings(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleNotificationToggle = (setting: string) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };
  
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppearanceSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAppearanceToggle = (setting: string) => {
    setAppearanceSettings(prev => ({ ...prev, [setting]: !prev[setting as keyof typeof prev] }));
  };
  
  const saveSettings = () => {
    // Here you would save the settings to your backend
    console.log('Saving settings...');
    console.log({
      profileSettings,
      platformSettings,
      notificationSettings,
      appearanceSettings
    });
    
    // Show a success message
    alert('Settings saved successfully!');
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDescription>
          Configure your dashboard and platform settings
        </PageDescription>
      </PageHeader>
      
      <SettingsContent>
        <SettingsSidebar>
          <SettingsNavItem href="#profile">
            <FaUser />
            <span>Profile</span>
          </SettingsNavItem>
          
          <SettingsNavItem href="#platform">
            <FaGlobe />
            <span>Platform</span>
          </SettingsNavItem>
          
          <SettingsNavItem href="#notifications">
            <FaBell />
            <span>Notifications</span>
          </SettingsNavItem>
          
          <SettingsNavItem href="#appearance">
            <FaPalette />
            <span>Appearance</span>
          </SettingsNavItem>
        </SettingsSidebar>
        
        <SettingsMain>
          <SaveSettingsButton onClick={saveSettings}>
            <FaSave />
            <span>Save Settings</span>
          </SaveSettingsButton>
          
          <SettingsSection id="profile">
            <SectionTitle>
              <FaUser />
              <span>Profile Settings</span>
            </SectionTitle>
            
            <FormGroup>
              <FormLabel>Full Name</FormLabel>
              <FormInput 
                type="text" 
                name="name" 
                value={profileSettings.name} 
                onChange={handleProfileChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Email Address</FormLabel>
              <FormInput 
                type="email" 
                name="email" 
                value={profileSettings.email} 
                onChange={handleProfileChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Phone Number</FormLabel>
              <FormInput 
                type="tel" 
                name="phone" 
                value={profileSettings.phone} 
                onChange={handleProfileChange} 
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <ChangePasswordButton>
                <FaLock />
                <span>Change Password</span>
              </ChangePasswordButton>
            </FormGroup>
          </SettingsSection>
          
          <SettingsSection id="platform">
            <SectionTitle>
              <FaGlobe />
              <span>Platform Settings</span>
            </SectionTitle>
            
            <SettingsGrid>
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Allow New Registrations</ToggleLabel>
                  <ToggleSwitch 
                    checked={platformSettings.allowNewRegistrations} 
                    onChange={() => handlePlatformToggle('allowNewRegistrations')} 
                  />
                </FormToggle>
                <FieldDescription>
                  When enabled, new users can register on the platform
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Auto-Assign Boosters</ToggleLabel>
                  <ToggleSwitch 
                    checked={platformSettings.autoAssignBoosters} 
                    onChange={() => handlePlatformToggle('autoAssignBoosters')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Automatically assign boosters to new orders
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Require Verification</ToggleLabel>
                  <ToggleSwitch 
                    checked={platformSettings.requireVerification} 
                    onChange={() => handlePlatformToggle('requireVerification')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Require email verification for new accounts
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Enable Live Chat</ToggleLabel>
                  <ToggleSwitch 
                    checked={platformSettings.enableLiveChat} 
                    onChange={() => handlePlatformToggle('enableLiveChat')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Enable live chat between clients and boosters
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Max File Size Upload (MB)</FormLabel>
                <FormInput 
                  type="number" 
                  name="maxFileSizeUpload" 
                  min="1" 
                  max="50" 
                  value={platformSettings.maxFileSizeUpload} 
                  onChange={handlePlatformChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Max Concurrent Orders per Booster</FormLabel>
                <FormInput 
                  type="number" 
                  name="maxConcurrentOrders" 
                  min="1" 
                  max="10" 
                  value={platformSettings.maxConcurrentOrders} 
                  onChange={handlePlatformChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Default Booster Commission Rate (%)</FormLabel>
                <FormInput 
                  type="number" 
                  name="defaultCommissionRate" 
                  min="1" 
                  max="100" 
                  value={platformSettings.defaultCommissionRate} 
                  onChange={handlePlatformChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Maintenance Mode</ToggleLabel>
                  <ToggleSwitch 
                    checked={platformSettings.maintenanceMode} 
                    onChange={() => handlePlatformToggle('maintenanceMode')} 
                    $danger
                  />
                </FormToggle>
                <FieldDescription>
                  Put the site in maintenance mode (only admins can access)
                </FieldDescription>
              </FormGroup>
            </SettingsGrid>
          </SettingsSection>
          
          <SettingsSection id="notifications">
            <SectionTitle>
              <FaBell />
              <span>Notification Settings</span>
            </SectionTitle>
            
            <SettingsGrid>
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Email Notifications</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.emailNotifications} 
                    onChange={() => handleNotificationToggle('emailNotifications')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Receive notifications via email
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Push Notifications</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.pushNotifications} 
                    onChange={() => handleNotificationToggle('pushNotifications')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Receive push notifications in browser
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Order Updates</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.orderUpdates} 
                    onChange={() => handleNotificationToggle('orderUpdates')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Notifications for order status changes
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Chat Messages</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.chatMessages} 
                    onChange={() => handleNotificationToggle('chatMessages')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Notifications for new chat messages
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Booster Status Changes</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.boosterStatusChanges} 
                    onChange={() => handleNotificationToggle('boosterStatusChanges')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Notifications when boosters go online/offline
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>System Alerts</ToggleLabel>
                  <ToggleSwitch 
                    checked={notificationSettings.systemAlerts} 
                    onChange={() => handleNotificationToggle('systemAlerts')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Important system notifications and alerts
                </FieldDescription>
              </FormGroup>
            </SettingsGrid>
          </SettingsSection>
          
          <SettingsSection id="appearance">
            <SectionTitle>
              <FaPalette />
              <span>Appearance Settings</span>
            </SectionTitle>
            
            <SettingsGrid>
              <FormGroup>
                <FormLabel>Theme</FormLabel>
                <FormSelect 
                  name="theme" 
                  value={appearanceSettings.theme} 
                  onChange={handleAppearanceChange}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System Default</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Font Size</FormLabel>
                <FormSelect 
                  name="fontSize" 
                  value={appearanceSettings.fontSize} 
                  onChange={handleAppearanceChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Sidebar Collapsed by Default</ToggleLabel>
                  <ToggleSwitch 
                    checked={appearanceSettings.sidebarCollapsed} 
                    onChange={() => handleAppearanceToggle('sidebarCollapsed')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Start with the sidebar collapsed for more workspace
                </FieldDescription>
              </FormGroup>
              
              <FormGroup>
                <FormToggle>
                  <ToggleLabel>Enable Animations</ToggleLabel>
                  <ToggleSwitch 
                    checked={appearanceSettings.enableAnimations} 
                    onChange={() => handleAppearanceToggle('enableAnimations')} 
                  />
                </FormToggle>
                <FieldDescription>
                  Enable animations and transitions in the interface
                </FieldDescription>
              </FormGroup>
            </SettingsGrid>
          </SettingsSection>
          
        </SettingsMain>
      </SettingsContent>
    </Container>
  );
};

const Container = styled.div``;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.text}aa;
`;

const SettingsContent = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 1.5rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsSidebar = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.border};
  position: sticky;
  top: 2rem;
  height: max-content;
  
  @media (max-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    position: static;
  }
`;

const SettingsNavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  color: ${({ theme }) => theme.text};
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
  
  @media (max-width: 992px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const SettingsMain = styled.div`
  position: relative;
`;

const SaveSettingsButton = styled.button`
  position: sticky;
  top: 2rem;
  right: 0;
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  margin-bottom: 1rem;
  width: max-content;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover || theme.primary + 'dd'};
  }
`;

const SettingsSection = styled.section`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  scroll-margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ToggleLabel = styled.span`
  font-weight: 500;
`;

const ToggleSwitch = styled.input.attrs({ type: 'checkbox' })<{ $danger?: boolean }>`
  position: relative;
  appearance: none;
  width: 50px;
  height: 24px;
  background: ${({ checked, theme, $danger }) => 
    checked 
      ? $danger 
        ? '#e74c3c' 
        : theme.primary 
      : theme.border};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    top: 2px;
    left: ${({ checked }) => checked ? '28px' : '2px'};
    background: white;
    transition: all 0.3s ease;
  }
`;

const FieldDescription = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.text}aa;
`;

const ChangePasswordButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: transparent;
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const AboutContent = styled.div`
  display: none; /* Hide the About section */
`;

const AboutLogo = styled.div`
  display: none;
`;

const AboutVersion = styled.div`
  display: none;
`;

const AboutDescription = styled.div`
  display: none;
`;

const AboutCopyright = styled.div`
  display: none;
`;

export default DashboardOwnerSettings; 