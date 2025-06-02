import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCog, FaUser, FaLock, FaBell, FaGlobe, FaCheck, FaTimes, FaQrcode, FaKey } from 'react-icons/fa';

const DashboardBoosterSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formMessage, setFormMessage] = useState({ type: '', message: '' });
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    username: 'ProBooster123',
    email: 'booster@example.com',
    firstName: 'John',
    lastName: 'Doe',
    bio: 'Professional booster with 5+ years of experience in League of Legends and Valorant.',
    discord: 'ProBooster#1234',
    paypalEmail: 'payments@example.com'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    enabled: false,
    verificationCode: '',
    showQrCode: false
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    orderUpdates: true,
    systemAnnouncements: true,
    marketingEmails: false
  });
  
  const [appearanceSettings, setAppearanceSettings] = useState({
    darkMode: true,
    language: 'english',
    timezone: 'UTC+0'
  });
  
  // Handle profile form changes
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm({
      ...profileForm,
      [name]: value
    });
  };
  
  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value
    });
  };
  
  // Toggle notification settings
  const toggleNotification = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };
  
  // Handle appearance settings changes
  const handleAppearanceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAppearanceSettings({
      ...appearanceSettings,
      [name]: value
    });
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setAppearanceSettings({
      ...appearanceSettings,
      darkMode: !appearanceSettings.darkMode
    });
  };
  
  // Toggle 2FA
  const toggle2FA = () => {
    if (!twoFactorAuth.enabled) {
      // When enabling 2FA, show the QR code
      setTwoFactorAuth({
        ...twoFactorAuth,
        showQrCode: true
      });
    } else {
      // When disabling 2FA, reset the state
      setTwoFactorAuth({
        enabled: false,
        verificationCode: '',
        showQrCode: false
      });
      
      // Show success message when disabling
      setFormMessage({
        type: 'success',
        message: 'Two-factor authentication has been disabled'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    }
  };
  
  // Handle 2FA verification code input
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwoFactorAuth({
      ...twoFactorAuth,
      verificationCode: e.target.value
    });
  };
  
  // Verify and enable 2FA
  const confirmTwoFactorSetup = () => {
    // Simulate verification
    if (twoFactorAuth.verificationCode.length === 6) {
      setTwoFactorAuth({
        enabled: true,
        verificationCode: '',
        showQrCode: false
      });
      
      setFormMessage({
        type: 'success',
        message: 'Two-factor authentication has been enabled'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    } else {
      setFormMessage({
        type: 'error',
        message: 'Invalid verification code. Please try again.'
      });
    }
  };
  
  // Submit forms
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to update profile
    setTimeout(() => {
      setFormMessage({
        type: 'success',
        message: 'Profile updated successfully!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    }, 500);
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setFormMessage({
        type: 'error',
        message: 'New passwords do not match!'
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setFormMessage({
        type: 'error',
        message: 'Password must be at least 8 characters long!'
      });
      return;
    }
    
    // Simulate API call to update password
    setTimeout(() => {
      setFormMessage({
        type: 'success',
        message: 'Password updated successfully!'
      });
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    }, 500);
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to update notification preferences
    setTimeout(() => {
      setFormMessage({
        type: 'success',
        message: 'Notification preferences updated!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    }, 500);
  };
  
  const handleAppearanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to update appearance settings
    setTimeout(() => {
      setFormMessage({
        type: 'success',
        message: 'Appearance settings updated!'
      });
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setFormMessage({ type: '', message: '' });
      }, 3000);
    }, 500);
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>
          <FaCog /> Settings
        </PageTitle>
      </PageHeader>
      
      <SettingsLayout>
        <SettingsTabs>
          <SettingsTab 
            $active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <TabIcon><FaUser /></TabIcon>
            <TabText>Profile</TabText>
          </SettingsTab>
          
          <SettingsTab 
            $active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <TabIcon><FaLock /></TabIcon>
            <TabText>Security</TabText>
          </SettingsTab>
          
          <SettingsTab 
            $active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            <TabIcon><FaBell /></TabIcon>
            <TabText>Notifications</TabText>
          </SettingsTab>
          
          <SettingsTab 
            $active={activeTab === 'appearance'} 
            onClick={() => setActiveTab('appearance')}
          >
            <TabIcon><FaGlobe /></TabIcon>
            <TabText>Appearance</TabText>
          </SettingsTab>
        </SettingsTabs>
        
        <SettingsContent>
          {formMessage.message && (
            <FormMessage $type={formMessage.type}>
              {formMessage.type === 'success' ? <FaCheck /> : <FaTimes />}
              {formMessage.message}
            </FormMessage>
          )}
          
          {activeTab === 'profile' && (
            <SettingsForm onSubmit={handleProfileSubmit}>
              <SettingsSectionTitle>Profile Information</SettingsSectionTitle>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Username</FormLabel>
                  <FormInput 
                    type="text" 
                    name="username" 
                    value={profileForm.username} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Email</FormLabel>
                  <FormInput 
                    type="email" 
                    name="email" 
                    value={profileForm.email} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>First Name</FormLabel>
                  <FormInput 
                    type="text" 
                    name="firstName" 
                    value={profileForm.firstName} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Last Name</FormLabel>
                  <FormInput 
                    type="text" 
                    name="lastName" 
                    value={profileForm.lastName} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <FormLabel>Biography</FormLabel>
                <FormTextarea 
                  name="bio" 
                  value={profileForm.bio} 
                  onChange={handleProfileChange} 
                />
              </FormGroup>
              
              <SettingsSectionTitle>Contact Information</SettingsSectionTitle>
              
              <FormRow>
                <FormGroup>
                  <FormLabel>Discord</FormLabel>
                  <FormInput 
                    type="text" 
                    name="discord" 
                    value={profileForm.discord} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>PayPal Email (for payments)</FormLabel>
                  <FormInput 
                    type="email" 
                    name="paypalEmail" 
                    value={profileForm.paypalEmail} 
                    onChange={handleProfileChange} 
                  />
                </FormGroup>
              </FormRow>
              
              <FormActions>
                <SubmitButton type="submit">Save Changes</SubmitButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'security' && (
            <SettingsForm onSubmit={handlePasswordSubmit}>
              <SettingsSectionTitle>Change Password</SettingsSectionTitle>
              
              <FormGroup>
                <FormLabel>Current Password</FormLabel>
                <FormInput 
                  type="password" 
                  name="currentPassword" 
                  value={passwordForm.currentPassword} 
                  onChange={handlePasswordChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>New Password</FormLabel>
                <FormInput 
                  type="password" 
                  name="newPassword" 
                  value={passwordForm.newPassword} 
                  onChange={handlePasswordChange} 
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm New Password</FormLabel>
                <FormInput 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordForm.confirmPassword} 
                  onChange={handlePasswordChange} 
                />
              </FormGroup>
              
              <SettingsSectionTitle>Two-Factor Authentication (2FA)</SettingsSectionTitle>
              
              <SwitchOption>
                <SwitchLabel>
                  Enable Two-Factor Authentication
                  <SwitchDescription>
                    Add an extra layer of security to your account with a verification code from your mobile device
                  </SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={twoFactorAuth.enabled} 
                  onClick={toggle2FA}
                >
                  <ToggleBall $active={twoFactorAuth.enabled} />
                </ToggleSwitch>
              </SwitchOption>
              
              {twoFactorAuth.showQrCode && (
                <TwoFactorSetupContainer>
                  <TwoFactorInstructions>
                    <h4>Set up Two-Factor Authentication</h4>
                    <ol>
                      <li>Download an authenticator app like Google Authenticator or Authy</li>
                      <li>Scan the QR code below with the app</li>
                      <li>Enter the 6-digit verification code from the app</li>
                    </ol>
                  </TwoFactorInstructions>
                  
                  <QrCodeContainer>
                    <QrCodeIcon>
                      <FaQrcode />
                    </QrCodeIcon>
                    <QrCodeText>QR Code for Authentication App</QrCodeText>
                  </QrCodeContainer>
                  
                  <VerificationCodeContainer>
                    <FormLabel>Verification Code</FormLabel>
                    <VerificationCodeInputGroup>
                      <VerificationCodeInput
                        type="text"
                        maxLength={6}
                        placeholder="Enter 6-digit code"
                        value={twoFactorAuth.verificationCode}
                        onChange={handleVerificationCodeChange}
                      />
                      <VerificationCodeButton 
                        onClick={confirmTwoFactorSetup}
                        disabled={twoFactorAuth.verificationCode.length !== 6}
                      >
                        <FaKey /> Verify
                      </VerificationCodeButton>
                    </VerificationCodeInputGroup>
                  </VerificationCodeContainer>
                  
                  <TwoFactorSetupNote>
                    Important: Store your backup codes in a safe place. You'll need these to access your account if you lose your phone.
                  </TwoFactorSetupNote>
                </TwoFactorSetupContainer>
              )}
              
              {twoFactorAuth.enabled && (
                <TwoFactorEnabledMessage>
                  <FaCheck /> Two-factor authentication is currently enabled for your account.
                </TwoFactorEnabledMessage>
              )}
              
              <FormActions>
                <SubmitButton type="submit">Update Password</SubmitButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'notifications' && (
            <SettingsForm onSubmit={handleNotificationsSubmit}>
              <SettingsSectionTitle>Notification Preferences</SettingsSectionTitle>
              
              <SwitchOption>
                <SwitchLabel>
                  Email Notifications
                  <SwitchDescription>Receive notifications via email</SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={notificationSettings.emailNotifications} 
                  onClick={() => toggleNotification('emailNotifications')}
                >
                  <ToggleBall $active={notificationSettings.emailNotifications} />
                </ToggleSwitch>
              </SwitchOption>
              
              <SwitchOption>
                <SwitchLabel>
                  Order Updates
                  <SwitchDescription>Get notified about order status changes</SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={notificationSettings.orderUpdates} 
                  onClick={() => toggleNotification('orderUpdates')}
                >
                  <ToggleBall $active={notificationSettings.orderUpdates} />
                </ToggleSwitch>
              </SwitchOption>
              
              <SwitchOption>
                <SwitchLabel>
                  System Announcements
                  <SwitchDescription>Important updates about the platform</SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={notificationSettings.systemAnnouncements} 
                  onClick={() => toggleNotification('systemAnnouncements')}
                >
                  <ToggleBall $active={notificationSettings.systemAnnouncements} />
                </ToggleSwitch>
              </SwitchOption>
              
              <SwitchOption>
                <SwitchLabel>
                  Marketing Emails
                  <SwitchDescription>Promotions and newsletter emails</SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={notificationSettings.marketingEmails} 
                  onClick={() => toggleNotification('marketingEmails')}
                >
                  <ToggleBall $active={notificationSettings.marketingEmails} />
                </ToggleSwitch>
              </SwitchOption>
              
              <FormActions>
                <SubmitButton type="submit">Save Preferences</SubmitButton>
              </FormActions>
            </SettingsForm>
          )}
          
          {activeTab === 'appearance' && (
            <SettingsForm onSubmit={handleAppearanceSubmit}>
              <SettingsSectionTitle>Appearance Settings</SettingsSectionTitle>
              
              <SwitchOption>
                <SwitchLabel>
                  Dark Mode
                  <SwitchDescription>Toggle between light and dark theme</SwitchDescription>
                </SwitchLabel>
                <ToggleSwitch 
                  $active={appearanceSettings.darkMode} 
                  onClick={toggleDarkMode}
                >
                  <ToggleBall $active={appearanceSettings.darkMode} />
                </ToggleSwitch>
              </SwitchOption>
              
              <FormGroup>
                <FormLabel>Language</FormLabel>
                <FormSelect 
                  name="language" 
                  value={appearanceSettings.language} 
                  onChange={handleAppearanceChange}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                  <option value="russian">Russian</option>
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Time Zone</FormLabel>
                <FormSelect 
                  name="timezone" 
                  value={appearanceSettings.timezone} 
                  onChange={handleAppearanceChange}
                >
                  <option value="UTC+0">UTC+0 - London</option>
                  <option value="UTC-5">UTC-5 - New York</option>
                  <option value="UTC-8">UTC-8 - Los Angeles</option>
                  <option value="UTC+1">UTC+1 - Paris</option>
                  <option value="UTC+2">UTC+2 - Athens</option>
                  <option value="UTC+3">UTC+3 - Moscow</option>
                  <option value="UTC+8">UTC+8 - Beijing</option>
                </FormSelect>
              </FormGroup>
              
              <FormActions>
                <SubmitButton type="submit">Save Settings</SubmitButton>
              </FormActions>
            </SettingsForm>
          )}
        </SettingsContent>
      </SettingsLayout>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SettingsLayout = styled.div`
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 1.5rem;
  }
`;

const SettingsTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  margin-bottom: 1.5rem;
  overflow-x: auto;
  
  @media (min-width: 768px) {
    flex-direction: column;
    border-bottom: none;
    border-right: 1px solid ${({ theme }) => theme.border};
    min-width: 200px;
    margin-bottom: 0;
  }
`;

const SettingsTab = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: ${({ theme, $active }) => $active ? theme.primary : theme.text};
  background: ${({ theme, $active }) => $active ? `${theme.primary}11` : 'transparent'};
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: max-content;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
    color: ${({ theme }) => theme.primary};
  }
  
  @media (min-width: 768px) {
    border-bottom: none;
    border-left: 2px solid ${({ theme, $active }) => $active ? theme.primary : 'transparent'};
    border-radius: 0 0.5rem 0.5rem 0;
  }
`;

const TabIcon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const TabText = styled.span``;

const SettingsContent = styled.div`
  flex: 1;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
`;

const SettingsForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const SettingsSectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const FormGroup = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FormLabel = styled.label`
  font-weight: 500;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.body};
  color: ${({ theme }) => theme.text};
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.body};
  color: ${({ theme }) => theme.text};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SubmitButton = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover || theme.primary}dd;
  }
`;

const FormMessage = styled.div<{ $type: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  background: ${({ theme, $type }) => 
    $type === 'success' ? `${theme.success}22` : 
    $type === 'error' ? `${theme.error}22` : 
    'transparent'
  };
  color: ${({ theme, $type }) => 
    $type === 'success' ? theme.success : 
    $type === 'error' ? theme.error : 
    theme.text
  };
  margin-bottom: 1rem;
`;

const SwitchOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
`;

const SwitchLabel = styled.div`
  display: flex;
  flex-direction: column;
`;

const SwitchDescription = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textLight};
  margin-top: 0.25rem;
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 50px;
  height: 24px;
  border-radius: 12px;
  background: ${({ theme, $active }) => $active ? theme.primary : theme.border};
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
`;

const ToggleBall = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  position: absolute;
  top: 2px;
  left: ${({ $active }) => $active ? '28px' : '2px'};
  transition: all 0.3s ease;
`;

const TwoFactorSetupContainer = styled.div`
  background: ${({ theme }) => theme.hover};
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const TwoFactorInstructions = styled.div`
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  ol {
    margin: 0;
    padding-left: 1.25rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const QrCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.5rem;
  border: 1px dashed ${({ theme }) => theme.border};
`;

const QrCodeIcon = styled.div`
  font-size: 8rem;
  color: ${({ theme }) => theme.primary};
`;

const QrCodeText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textLight};
`;

const VerificationCodeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const VerificationCodeInputGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const VerificationCodeInput = styled(FormInput)`
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-align: center;
`;

const VerificationCodeButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.buttonHover || theme.primary}dd;
  }
  
  &:disabled {
    background: ${({ theme }) => theme.border};
    cursor: not-allowed;
  }
`;

const TwoFactorSetupNote = styled.div`
  font-size: 0.9rem;
  padding: 1rem;
  background: ${({ theme }) => `${theme.warning}22`};
  color: ${({ theme }) => theme.warning};
  border-radius: 0.5rem;
  border-left: 3px solid ${({ theme }) => theme.warning};
`;

const TwoFactorEnabledMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 1rem;
  background: ${({ theme }) => `${theme.success}22`};
  color: ${({ theme }) => theme.success};
  border-radius: 0.5rem;
  border-left: 3px solid ${({ theme }) => theme.success};
`;

export default DashboardBoosterSettings; 