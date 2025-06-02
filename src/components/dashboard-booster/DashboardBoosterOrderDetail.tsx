import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  FaTasks, FaArrowLeft, FaInfoCircle, FaUser, FaCalendarAlt, 
  FaClock, FaFileAlt, FaImages, FaCheck, FaSpinner, FaExclamationTriangle 
} from 'react-icons/fa';

const DashboardBoosterOrderDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [progressReports, setProgressReports] = useState<any[]>([]);
  const [newReport, setNewReport] = useState({
    description: '',
    progress: 0,
    images: [] as File[],
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  // Simulate loading order data
  useEffect(() => {
    const timer = setTimeout(() => {
      // Mock data - in a real app this would come from API
      if (orderId === 'ORD-123456') {
        setOrder({
          id: 'ORD-123456',
          game: 'League of Legends',
          type: 'Solo Boost',
          from: 'Silver II',
          to: 'Gold IV',
          client: 'Anonymous',
          deadline: '2023-06-25',
          payment: 55,
          createdAt: '2023-06-10',
          status: 'In Progress',
          progress: 35,
          description: 'Boost my account from Silver II to Gold IV. I prefer safe play and not drawing attention. Please use champions in my pool if possible.',
          clientNotes: 'I have champion pool limitations. Please check my message for details.',
          requirements: [
            'Use champions in client pool when possible',
            'Play safe to avoid reports',
            'Maximum 3 games per day',
            'Avoid chatting in game'
          ],
          championPool: ['Ahri', 'Lux', 'Annie', 'Veigar', 'Orianna']
        });

        setProgressReports([
          {
            id: 1,
            date: '2023-06-12',
            progress: 15,
            description: 'Started the boost. Won 3 out of 4 games. Currently at Silver II 45LP.',
            images: ['https://via.placeholder.com/400x220?text=Game+Result+1'],
            status: 'approved'
          },
          {
            id: 2,
            date: '2023-06-14',
            progress: 35,
            description: 'Good progress. Won 4 out of 5 games. Currently at Silver I 30LP.',
            images: ['https://via.placeholder.com/400x220?text=Game+Result+2', 'https://via.placeholder.com/400x220?text=Game+Result+3'],
            status: 'approved'
          }
        ]);
      } else if (orderId === 'ORD-789012') {
        setOrder({
          id: 'ORD-789012',
          game: 'Valorant',
          type: 'Rank Boost',
          from: 'Bronze III',
          to: 'Silver II',
          client: 'Anonymous',
          deadline: '2023-06-28',
          payment: 45,
          createdAt: '2023-06-15',
          status: 'In Progress',
          progress: 20,
          description: 'Please boost my Valorant account to Silver II. I mainly play duelists but feel free to play any agent.',
          clientNotes: 'No specific requirements, just win games.',
          requirements: [
            'No specific agent requirements',
            'Try to win as many games as possible',
            'Maximum 5 games per day'
          ],
          agentPool: ['All agents available']
        });

        setProgressReports([
          {
            id: 1,
            date: '2023-06-16',
            progress: 20,
            description: 'Started the boost. Won 3 out of 4 games. Currently at Bronze III 78/100.',
            images: ['https://via.placeholder.com/400x220?text=Valorant+Match+1'],
            status: 'approved'
          }
        ]);
      } else {
        // Default mock data for other IDs
        setOrder({
          id: orderId,
          game: 'League of Legends',
          type: 'Solo Boost',
          from: 'Bronze I',
          to: 'Silver III',
          client: 'Anonymous',
          deadline: '2023-06-30',
          payment: 40,
          createdAt: '2023-06-05',
          status: 'In Progress',
          progress: 50,
          description: 'Generic boost order details here.',
          clientNotes: 'No specific notes from client',
          requirements: [
            'Standard boosting requirements',
            'Play safe to avoid reports'
          ],
          championPool: ['All champions']
        });

        setProgressReports([
          {
            id: 1,
            date: '2023-06-07',
            progress: 25,
            description: 'Started the boost. Making good progress.',
            images: [],
            status: 'approved'
          },
          {
            id: 2,
            date: '2023-06-10',
            progress: 50,
            description: 'Halfway through. Everything going well.',
            images: [],
            status: 'approved'
          }
        ]);
      }

      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [orderId]);

  // Handle going back to orders list
  const handleGoBack = () => {
    navigate('/booster/orders');
  };

  // Handle input change for new report
  const handleReportInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReport({
      ...newReport,
      [name]: value
    });
  };

  // Handle progress slider change
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const progress = parseInt(e.target.value, 10);
    setNewReport({
      ...newReport,
      progress
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Create object URLs for preview
      const newImageUrls = filesArray.map(file => URL.createObjectURL(file));
      
      setUploadedImageUrls([...uploadedImageUrls, ...newImageUrls]);
      setNewReport({
        ...newReport,
        images: [...newReport.images, ...filesArray]
      });
    }
  };

  // Handle removing uploaded image
  const handleRemoveImage = (index: number) => {
    const newImages = [...newReport.images];
    newImages.splice(index, 1);
    
    const newImageUrls = [...uploadedImageUrls];
    URL.revokeObjectURL(newImageUrls[index]); // Clean up the URL
    newImageUrls.splice(index, 1);
    
    setNewReport({
      ...newReport,
      images: newImages
    });
    setUploadedImageUrls(newImageUrls);
  };

  // Submit progress report
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (newReport.description.trim() === '') {
      alert('Please provide a description of your progress');
      return;
    }
    
    // Set loading state
    setSubmitStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      // Generate a new report ID
      const newReportId = progressReports.length + 1;
      
      // Create new report object
      const reportToAdd = {
        id: newReportId,
        date: new Date().toISOString().split('T')[0],
        progress: newReport.progress,
        description: newReport.description,
        images: uploadedImageUrls,
        status: 'pending'
      };
      
      // Add to reports array
      setProgressReports([...progressReports, reportToAdd]);
      
      // Update order progress if the new progress is higher
      if (newReport.progress > (order?.progress || 0)) {
        setOrder({
          ...order,
          progress: newReport.progress
        });
      }
      
      // Reset form
      setNewReport({
        description: '',
        progress: 0,
        images: []
      });
      setUploadedImageUrls([]);
      
      // Set success state
      setSubmitStatus('success');
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 3000);
    }, 1500);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#4caf50';
      case 'in progress':
        return '#2196f3';
      case 'pending':
        return '#ff9800';
      default:
        return '#2196f3';
    }
  };

  // Format date to more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <BackButton onClick={handleGoBack}>
        <FaArrowLeft /> Back to Orders
      </BackButton>

      {isLoading ? (
        <LoadingContainer>
          <FaSpinner className="spinning" />
          <LoadingText>Loading order details...</LoadingText>
        </LoadingContainer>
      ) : order ? (
        <>
          <OrderHeader>
            <OrderTitle>
              <FaTasks /> Order {order.id}
            </OrderTitle>
            <StatusBadge $color={getStatusColor(order.status)}>
              {order.status}
            </StatusBadge>
          </OrderHeader>

          <ContentGrid>
            <OrderDetailsCard>
              <SectionTitle>Order Details</SectionTitle>
              <DetailRow>
                <DetailLabel>Game:</DetailLabel>
                <DetailValue>{order.game}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Type:</DetailLabel>
                <DetailValue>{order.type}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Boost:</DetailLabel>
                <DetailValue>{order.from} → {order.to}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Payment:</DetailLabel>
                <DetailValue>${order.payment}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Created:</DetailLabel>
                <DetailValue>{formatDate(order.createdAt)}</DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Deadline:</DetailLabel>
                <DetailValue>
                  <FaCalendarAlt style={{ marginRight: '5px' }} />
                  {formatDate(order.deadline)}
                </DetailValue>
              </DetailRow>
              <DetailRow>
                <DetailLabel>Client:</DetailLabel>
                <DetailValue>
                  <FaUser style={{ marginRight: '5px' }} />
                  {order.client}
                </DetailValue>
              </DetailRow>
            </OrderDetailsCard>

            <DescriptionCard>
              <SectionTitle>Description</SectionTitle>
              <Description>{order.description}</Description>
              
              {order.clientNotes && (
                <>
                  <SubSectionTitle>Client Notes</SubSectionTitle>
                  <ClientNotes>{order.clientNotes}</ClientNotes>
                </>
              )}
              
              <SubSectionTitle>Requirements</SubSectionTitle>
              <RequirementsList>
                {order.requirements.map((req: string, index: number) => (
                  <RequirementItem key={index}>
                    <FaCheck style={{ 
                      color: '#4caf50', 
                      marginRight: '8px',
                      minWidth: '14px'
                    }} />
                    {req}
                  </RequirementItem>
                ))}
              </RequirementsList>

              {order.championPool && (
                <>
                  <SubSectionTitle>Champion Pool</SubSectionTitle>
                  <ChampionPoolContainer>
                    {order.championPool.map((champion: string, index: number) => (
                      <ChampionTag key={index}>{champion}</ChampionTag>
                    ))}
                  </ChampionPoolContainer>
                </>
              )}
              
              {order.agentPool && (
                <>
                  <SubSectionTitle>Agent Pool</SubSectionTitle>
                  <ChampionPoolContainer>
                    {order.agentPool.map((agent: string, index: number) => (
                      <ChampionTag key={index}>{agent}</ChampionTag>
                    ))}
                  </ChampionPoolContainer>
                </>
              )}
            </DescriptionCard>

            <ProgressCard>
              <SectionTitle>Overall Progress</SectionTitle>
              <ProgressWrapper>
                <ProgressBarContainer>
                  <ProgressBarFill style={{ width: `${order.progress}%` }} />
                </ProgressBarContainer>
                <ProgressPercentage>{order.progress}%</ProgressPercentage>
              </ProgressWrapper>
              
              <ProgressInfoBox>
                <FaInfoCircle style={{ color: '#2196f3', marginRight: '10px' }} />
                <ProgressInfoText>
                  Submit regular progress reports to update the progress bar. This helps keep the client informed and ensures smooth completion of the order.
                </ProgressInfoText>
              </ProgressInfoBox>
            </ProgressCard>

            <ReportSubmissionCard>
              <SectionTitle>Submit Progress Report</SectionTitle>
              <form onSubmit={handleSubmitReport}>
                <FormGroup>
                  <FormLabel>Progress (%)</FormLabel>
                  <ProgressSliderContainer>
                    <ProgressSlider 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      name="progress"
                      value={newReport.progress}
                      onChange={handleProgressChange}
                    />
                    <ProgressSliderValue>{newReport.progress}%</ProgressSliderValue>
                  </ProgressSliderContainer>
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Description</FormLabel>
                  <FormTextarea 
                    name="description"
                    value={newReport.description}
                    onChange={handleReportInputChange}
                    placeholder="Describe your progress in detail (games played, current rank/LP, any challenges faced, etc.)"
                    rows={4}
                    required
                  />
                </FormGroup>
                
                <FormGroup>
                  <FormLabel>Upload Images (Optional)</FormLabel>
                  <FileUploadContainer>
                    <FileUploadLabel>
                      <FaImages /> Add Screenshots
                      <FileInput 
                        type="file" 
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                      />
                    </FileUploadLabel>
                    <FileUploadHelp>Support JPG, PNG, WEBP. Max 5MB each.</FileUploadHelp>
                  </FileUploadContainer>
                  
                  {uploadedImageUrls.length > 0 && (
                    <UploadedImagesContainer>
                      {uploadedImageUrls.map((url, index) => (
                        <UploadedImageWrapper key={index}>
                          <UploadedImage src={url} alt={`Upload ${index + 1}`} />
                          <RemoveImageButton type="button" onClick={() => handleRemoveImage(index)}>
                            ×
                          </RemoveImageButton>
                        </UploadedImageWrapper>
                      ))}
                    </UploadedImagesContainer>
                  )}
                </FormGroup>
                
                <SubmitButtonContainer>
                  <SubmitButton 
                    type="submit"
                    disabled={submitStatus === 'loading'}
                  >
                    {submitStatus === 'loading' ? (
                      <>
                        <FaSpinner className="spinning" /> Submitting...
                      </>
                    ) : (
                      <>
                        <FaFileAlt /> Submit Report
                      </>
                    )}
                  </SubmitButton>
                  
                  {submitStatus === 'success' && (
                    <SubmitSuccessMessage>
                      <FaCheck /> Report submitted successfully!
                    </SubmitSuccessMessage>
                  )}
                  
                  {submitStatus === 'error' && (
                    <SubmitErrorMessage>
                      <FaExclamationTriangle /> Error submitting report. Please try again.
                    </SubmitErrorMessage>
                  )}
                </SubmitButtonContainer>
              </form>
            </ReportSubmissionCard>

            <ProgressHistoryCard>
              <SectionTitle>Progress History</SectionTitle>
              
              {progressReports.length === 0 ? (
                <NoReportsMessage>No progress reports yet. Submit your first report above.</NoReportsMessage>
              ) : (
                <ReportsList>
                  {progressReports.map((report) => (
                    <ReportItem key={report.id}>
                      <ReportHeader>
                        <ReportDate>{formatDate(report.date)}</ReportDate>
                        <ReportProgress>Progress: {report.progress}%</ReportProgress>
                      </ReportHeader>
                      
                      <ReportDescription>{report.description}</ReportDescription>
                      
                      {report.images && report.images.length > 0 && (
                        <ReportImages>
                          {report.images.map((image: string, index: number) => (
                            <ReportImage key={index} src={image} alt="Progress screenshot" />
                          ))}
                        </ReportImages>
                      )}
                      
                      <ReportStatus $status={report.status}>
                        {report.status === 'approved' ? (
                          <>
                            <FaCheck /> Approved
                          </>
                        ) : report.status === 'rejected' ? (
                          <>
                            <FaExclamationTriangle /> Rejected
                          </>
                        ) : (
                          <>
                            <FaClock /> Pending Review
                          </>
                        )}
                      </ReportStatus>
                    </ReportItem>
                  ))}
                </ReportsList>
              )}
            </ProgressHistoryCard>
          </ContentGrid>
        </>
      ) : (
        <NotFoundMessage>
          <FaExclamationTriangle />
          Order not found or you do not have permission to view it
        </NotFoundMessage>
      )}
    </Container>
  );
};

// Styled components
const Container = styled(motion.div)`
  width: 100%;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: ${({ theme }) => theme.textLight};
  
  .spinning {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  margin-bottom: 1.5rem;
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(-5px);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const OrderTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  background: ${({ $color }) => `${$color}22`};
  color: ${({ $color }) => $color};
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 2fr;
  }
`;

const Card = styled.div`
  background: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
`;

const OrderDetailsCard = styled(Card)`
  grid-column: 1 / -1;
  
  @media (min-width: 768px) {
    grid-column: 1;
  }
`;

const DescriptionCard = styled(Card)`
  grid-column: 1 / -1;
  
  @media (min-width: 768px) {
    grid-column: 2;
  }
`;

const ProgressCard = styled(Card)`
  grid-column: 1 / -1;
`;

const ReportSubmissionCard = styled(Card)`
  grid-column: 1 / -1;
`;

const ProgressHistoryCard = styled(Card)`
  grid-column: 1 / -1;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 1.25rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SubSectionTitle = styled.h3`
  font-size: 1.1rem;
  margin: 1.25rem 0 0.75rem 0;
  color: ${({ theme }) => theme.text};
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.div`
  width: 100px;
  font-weight: 500;
  color: ${({ theme }) => theme.textLight};
  flex-shrink: 0;
`;

const DetailValue = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Description = styled.p`
  margin: 0;
  line-height: 1.5;
`;

const ClientNotes = styled.p`
  margin: 0;
  padding: 0.75rem;
  background: ${({ theme }) => `${theme.primary}11`};
  border-left: 3px solid ${({ theme }) => theme.primary};
  border-radius: 0.25rem;
  line-height: 1.5;
`;

const RequirementsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RequirementItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
`;

const ChampionPoolContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const ChampionTag = styled.div`
  padding: 0.4rem 0.8rem;
  background: ${({ theme }) => theme.hover};
  border-radius: 2rem;
  font-size: 0.9rem;
`;

const ProgressWrapper = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const ProgressBarContainer = styled.div`
  height: 20px;
  background: ${({ theme }) => theme.border};
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressBarFill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.primary};
  border-radius: 10px;
  transition: width 0.5s ease;
`;

const ProgressPercentage = styled.div`
  position: absolute;
  top: -5px;
  right: 0;
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const ProgressInfoBox = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  background: ${({ theme }) => `${theme.info}11`};
  border-radius: 0.5rem;
  margin-top: 0.5rem;
`;

const ProgressInfoText = styled.div`
  font-size: 0.9rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.text};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background: ${({ theme }) => theme.inputBg || theme.cardBg};
  color: ${({ theme }) => theme.text};
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

const ProgressSliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ProgressSlider = styled.input`
  flex: 1;
  height: 5px;
  -webkit-appearance: none;
  background: ${({ theme }) => theme.border};
  border-radius: 5px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${({ theme }) => theme.primary};
    cursor: pointer;
    border: none;
  }
`;

const ProgressSliderValue = styled.div`
  width: 60px;
  font-weight: 600;
  text-align: center;
`;

const FileUploadContainer = styled.div`
  margin-bottom: 1rem;
`;

const FileUploadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: ${({ theme }) => `${theme.primary}22`};
  color: ${({ theme }) => theme.primary};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: ${({ theme }) => `${theme.primary}33`};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const FileUploadHelp = styled.div`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.textLight};
  margin-top: 0.5rem;
`;

const UploadedImagesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const UploadedImageWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const UploadedImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ theme }) => theme.error};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
`;

const SubmitButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ theme }) => theme.buttonHover || theme.primary}dd;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinning {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const SubmitSuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.success};
`;

const SubmitErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.error};
`;

const NoReportsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.textLight};
`;

const ReportsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ReportItem = styled.div`
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 0.5rem;
  padding: 1rem;
  background: ${({ theme }) => theme.hover};
`;

const ReportHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

const ReportDate = styled.div`
  font-weight: 500;
`;

const ReportProgress = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
`;

const ReportDescription = styled.div`
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const ReportImages = styled.div`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

const ReportImage = styled.img`
  height: 100px;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ReportStatus = styled.div<{ $status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-size: 0.9rem;
  font-weight: 500;
  background: ${({ theme, $status }) => 
    $status === 'approved' ? `${theme.success}22` :
    $status === 'rejected' ? `${theme.error}22` :
    `${theme.warning}22`
  };
  color: ${({ theme, $status }) => 
    $status === 'approved' ? theme.success :
    $status === 'rejected' ? theme.error :
    theme.warning
  };
`;

const NotFoundMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 3rem;
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.textLight};
  
  svg {
    font-size: 3rem;
    color: ${({ theme }) => theme.warning};
  }
`;

export default DashboardBoosterOrderDetail; 