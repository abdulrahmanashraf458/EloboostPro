import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  FaUser, FaShieldAlt, FaBell, FaKey, 
  FaCamera, FaCheck, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { SelectionProps, ButtonProps } from '../../styles/StyledComponentTypes';

const DashboardSettings: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  
  // User profile state
  const [profileForm, setProfileForm] = useState({
    username: user?.username || 'User123',
    email: user?.email || 'user@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1 555-123-4567',
    country: 'United States',
    language: 'English'
  });
  
  // Security state
  const [showPassword, setShowPassword] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Notification state
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    orderCompletion: true,
    chat: true,
    promotions: false,
    newsletter: false
  });
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm({ ...profileForm, [name]: value });
  };
  
  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecurityForm({ ...securityForm, [name]: value });
  };
  
  const handleNotificationToggle = (name: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [name]: !notifications[name]
    });
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Settings</PageTitle>
        <PageDescription>
          Manage your profile, security, and preferences
        </PageDescription>
      </PageHeader>
      
      <SettingsLayout>
        <SettingsTabs>
          <SettingsTab 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <TabIcon>
              <FaUser />
            </TabIcon>
            <TabLabel>Profile</TabLabel>
          </SettingsTab>
          
          <SettingsTab 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            <TabIcon>
              <FaShieldAlt />
            </TabIcon>
            <TabLabel>Security</TabLabel>
          </SettingsTab>
          
          <SettingsTab 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            <TabIcon>
              <FaBell />
            </TabIcon>
            <TabLabel>Notifications</TabLabel>
          </SettingsTab>
        </SettingsTabs>
        
        <SettingsContent>
          {activeTab === 'profile' && (
            <SettingsSection>
              <SectionTitle>Your Profile</SectionTitle>
              
              <ProfileHeader>
                <ProfileAvatar>
                  <img src={user?.avatar || 'https://i.pravatar.cc/150?u=user123'} alt="Profile" />
                  <ChangeAvatarButton>
                    <FaCamera />
                  </ChangeAvatarButton>
                </ProfileAvatar>
                <ProfileInfo>
                  <ProfileName>{profileForm.firstName} {profileForm.lastName}</ProfileName>
                  <ProfileEmail>{profileForm.email}</ProfileEmail>
                </ProfileInfo>
              </ProfileHeader>
              
              <FormGroup>
                <FormRow>
                  <FormField>
                    <FormLabel htmlFor="firstName">First Name</FormLabel>
                    <FormInput 
                      type="text" 
                      id="firstName" 
                      name="firstName" 
                      value={profileForm.firstName} 
                      onChange={handleProfileChange} 
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="lastName">Last Name</FormLabel>
                    <FormInput 
                      type="text" 
                      id="lastName" 
                      name="lastName" 
                      value={profileForm.lastName} 
                      onChange={handleProfileChange} 
                    />
                  </FormField>
                </FormRow>
                
                <FormRow>
                  <FormField>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <FormInput 
                      type="text" 
                      id="username" 
                      name="username" 
                      value={profileForm.username} 
                      onChange={handleProfileChange} 
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="email">Email Address</FormLabel>
                    <FormInput 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={profileForm.email} 
                      onChange={handleProfileChange} 
                    />
                  </FormField>
                </FormRow>
                
                <FormRow>
                  <FormField>
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <FormInput 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={profileForm.phone} 
                      onChange={handleProfileChange} 
                    />
                  </FormField>
                  <FormField>
                    <FormLabel htmlFor="country">Country</FormLabel>
                    <FormSelect 
                      id="country" 
                      name="country" 
                      value={profileForm.country} 
                      onChange={handleProfileChange}
                    >
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                    </FormSelect>
                  </FormField>
                </FormRow>
                
                <FormRow>
                  <FormField>
                    <FormLabel htmlFor="language">Preferred Language</FormLabel>
                    <FormSelect 
                      id="language" 
                      name="language" 
                      value={profileForm.language} 
                      onChange={handleProfileChange}
                    >
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Spanish">Spanish</option>
                    </FormSelect>
                  </FormField>
                </FormRow>
              </FormGroup>
              
              <FormActions>
                <SaveButton>Save Changes</SaveButton>
                <CancelButton>Cancel</CancelButton>
              </FormActions>
            </SettingsSection>
          )}
          
          {activeTab === 'security' && (
            <SettingsSection>
              <SectionTitle>Security Settings</SectionTitle>
              
              <SecurityCard>
                <SecurityCardHeader>
                  <SecurityCardTitle>
                    <FaKey />
                    <span>Change Password</span>
                  </SecurityCardTitle>
                </SecurityCardHeader>
                
                <FormGroup>
                  <FormField>
                    <FormLabel htmlFor="currentPassword">Current Password</FormLabel>
                    <PasswordInputWrapper>
                      <FormInput 
                        type={showPassword ? 'text' : 'password'} 
                        id="currentPassword" 
                        name="currentPassword" 
                        value={securityForm.currentPassword} 
                        onChange={handleSecurityChange} 
                      />
                      <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </PasswordToggle>
                    </PasswordInputWrapper>
                  </FormField>
                  
                  <FormField>
                    <FormLabel htmlFor="newPassword">New Password</FormLabel>
                    <PasswordInputWrapper>
                      <FormInput 
                        type={showPassword ? 'text' : 'password'} 
                        id="newPassword" 
                        name="newPassword" 
                        value={securityForm.newPassword} 
                        onChange={handleSecurityChange} 
                      />
                      <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </PasswordToggle>
                    </PasswordInputWrapper>
                  </FormField>
                  
                  <FormField>
                    <FormLabel htmlFor="confirmPassword">Confirm New Password</FormLabel>
                    <PasswordInputWrapper>
                      <FormInput 
                        type={showPassword ? 'text' : 'password'} 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={securityForm.confirmPassword} 
                        onChange={handleSecurityChange} 
                      />
                      <PasswordToggle onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </PasswordToggle>
                    </PasswordInputWrapper>
                  </FormField>
                </FormGroup>
                
                <ButtonContainer>
                  <SaveButton>Update Password</SaveButton>
                </ButtonContainer>
              </SecurityCard>
              
              <SecurityCard>
                <SecurityCardHeader>
                  <SecurityCardTitle>
                    <FaShieldAlt />
                    <span>Two-Factor Authentication</span>
                  </SecurityCardTitle>
                </SecurityCardHeader>
                
                <SecurityCardContent>
                  <p>
                    Two-factor authentication adds an extra layer of security to your account. 
                    In addition to your password, you'll need to provide a code from your phone.
                  </p>
                  <ButtonContainer>
                    <PrimaryButton>Enable 2FA</PrimaryButton>
                  </ButtonContainer>
                </SecurityCardContent>
              </SecurityCard>
            </SettingsSection>
          )}
          
          {activeTab === 'notifications' && (
            <SettingsSection>
              <SectionTitle>Notification Settings</SectionTitle>
              
              <NotificationsList>
                <NotificationItem>
                  <NotificationInfo>
                    <NotificationTitle>Order Updates</NotificationTitle>
                    <NotificationDescription>
                      Receive notifications about your order status changes
                    </NotificationDescription>
                  </NotificationInfo>
                  <NotificationToggle>
                    <ToggleSwitch 
                      checked={notifications.orderUpdates} 
                      onChange={() => handleNotificationToggle('orderUpdates')}
                    />
                  </NotificationToggle>
                </NotificationItem>
                
                <NotificationItem>
                  <NotificationInfo>
                    <NotificationTitle>Order Completion</NotificationTitle>
                    <NotificationDescription>
                      Get notified when your orders are completed
                    </NotificationDescription>
                  </NotificationInfo>
                  <NotificationToggle>
                    <ToggleSwitch 
                      checked={notifications.orderCompletion} 
                      onChange={() => handleNotificationToggle('orderCompletion')}
                    />
                  </NotificationToggle>
                </NotificationItem>
                
                <NotificationItem>
                  <NotificationInfo>
                    <NotificationTitle>Chat Messages</NotificationTitle>
                    <NotificationDescription>
                      Receive notifications for new messages from boosters
                    </NotificationDescription>
                  </NotificationInfo>
                  <NotificationToggle>
                    <ToggleSwitch 
                      checked={notifications.chat} 
                      onChange={() => handleNotificationToggle('chat')}
                    />
                  </NotificationToggle>
                </NotificationItem>
                
                <NotificationItem>
                  <NotificationInfo>
                    <NotificationTitle>Promotions and Discounts</NotificationTitle>
                    <NotificationDescription>
                      Get notified about special offers and discounts
                    </NotificationDescription>
                  </NotificationInfo>
                  <NotificationToggle>
                    <ToggleSwitch 
                      checked={notifications.promotions} 
                      onChange={() => handleNotificationToggle('promotions')}
                    />
                  </NotificationToggle>
                </NotificationItem>
                
                <NotificationItem>
                  <NotificationInfo>
                    <NotificationTitle>Newsletter</NotificationTitle>
                    <NotificationDescription>
                      Receive our monthly newsletter with tips and updates
                    </NotificationDescription>
                  </NotificationInfo>
                  <NotificationToggle>
                    <ToggleSwitch 
                      checked={notifications.newsletter} 
                      onChange={() => handleNotificationToggle('newsletter')}
                    />
                  </NotificationToggle>
                </NotificationItem>
              </NotificationsList>
              
              <FormActions>
                <SaveButton>Save Preferences</SaveButton>
              </FormActions>
            </SettingsSection>
          )}
        </SettingsContent>
      </SettingsLayout>
    </Container>
  );
};

interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <SwitchContainer>
      <SwitchInput type="checkbox" checked={checked} onChange={onChange} />
      <SwitchSlider />
    </SwitchContainer>
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

const SettingsLayout = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const SettingsTabs = styled.div`
  @media (max-width: 992px) {
    display: flex;
    overflow-x: auto;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`;

const SettingsTab = styled.div<SelectionProps>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 0.5rem;
  background: ${({ active, theme }) => 
    active ? `${theme.primary}11` : 'transparent'};
  color: ${({ active, theme }) => 
    active ? theme.primary : theme.text};
    
  &:hover {
    background: ${({ active, theme }) => 
      active ? `${theme.primary}11` : theme.hover};
  }
  
  @media (max-width: 992px) {
    margin-bottom: 0;
    padding: 0.75rem 1rem;
    white-space: nowrap;
  }
`;

const TabIcon = styled.div`
  font-size: 1.25rem;
  margin-right: 0.75rem;
  display: flex;
  align-items: center;
`;

const TabLabel = styled.div`
  font-weight: 500;
`;

const SettingsContent = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const SettingsSection = styled.div`
  padding: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const ProfileAvatar = styled.div`
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 2rem;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const ChangeAvatarButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ theme }) => theme.cardBg};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const ProfileInfo = styled.div``;

const ProfileName = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const ProfileEmail = styled.div`
  color: ${({ theme }) => theme.text}aa;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormField = styled.div``;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.body};
  color: ${({ theme }) => theme.text};
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary}33;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.text}aa;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const SaveButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
  }
`;

const CancelButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: ${({ theme }) => theme.text};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.hover};
  }
`;

const PrimaryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover};
    transform: translateY(-3px);
  }
`;

const SecurityCard = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.75rem;
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const SecurityCardHeader = styled.div`
  padding: 1.25rem;
  background: ${({ theme }) => theme.body};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SecurityCardTitle = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: ${({ theme }) => theme.primary};
  }
`;

const SecurityCardContent = styled.div`
  padding: 1.5rem;
  
  p {
    margin-bottom: 1.5rem;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 1.5rem;
`;

const NotificationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const NotificationItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const NotificationInfo = styled.div`
  flex: 1;
`;

const NotificationTitle = styled.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const NotificationDescription = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.text}aa;
`;

const NotificationToggle = styled.div`
  margin-left: 1.5rem;
`;

const SwitchContainer = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  cursor: pointer;
`;

const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: ${({ theme }) => theme.primary};
  }
  
  &:checked + span:before {
    transform: translateX(24px);
  }
`;

const SwitchSlider = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.border};
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

export default DashboardSettings; 