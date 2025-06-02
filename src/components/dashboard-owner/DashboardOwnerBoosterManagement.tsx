import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch, FaEdit, FaTrash, FaKey, FaUserPlus, FaUserSlash, FaCheck, FaTimes, FaSort, FaEye, FaFilter } from 'react-icons/fa';
import BoosterFormModal from './BoosterFormModal';
import BoosterPermissionsModal from './BoosterPermissionsModal';
import BoosterActivityModal from './BoosterActivityModal';
import DeleteBoosterModal from './DeleteBoosterModal';

interface Booster {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  joinDate: Date;
  status: 'online' | 'offline' | 'away' | 'banned';
  completedOrders: number;
  rating: number;
  specialization: string[];
  permissions: {
    canAccessChat: boolean;
    canModifyOrders: boolean;
    canAccessClientDetails: boolean;
    isAdmin: boolean;
  };
}

const DashboardOwnerBoosterManagement: React.FC = () => {
  const [boosters, setBoosters] = useState<Booster[]>([]);
  const [filteredBoosters, setFilteredBoosters] = useState<Booster[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddBoosterModal, setShowAddBoosterModal] = useState(false);
  const [showEditBoosterModal, setShowEditBoosterModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBooster, setSelectedBooster] = useState<Booster | null>(null);
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Mock data for demonstration
  useEffect(() => {
    const mockBoosters: Booster[] = [
      {
        id: 'booster1',
        name: 'RankHero',
        avatar: 'https://i.pravatar.cc/150?u=booster1',
        email: 'rankhero@example.com',
        phone: '+1 234 567 8901',
        joinDate: new Date(2022, 5, 15),
        status: 'online',
        completedOrders: 145,
        rating: 4.8,
        specialization: ['Solo Boost', 'Duo Boost', 'Coaching'],
        permissions: {
          canAccessChat: true,
          canModifyOrders: true,
          canAccessClientDetails: true,
          isAdmin: false,
        }
      },
      {
        id: 'booster2',
        name: 'DuoKing',
        avatar: 'https://i.pravatar.cc/150?u=booster2',
        email: 'duoking@example.com',
        phone: '+1 987 654 3210',
        joinDate: new Date(2021, 3, 22),
        status: 'away',
        completedOrders: 287,
        rating: 4.9,
        specialization: ['Duo Boost', 'Placement Matches'],
        permissions: {
          canAccessChat: true,
          canModifyOrders: false,
          canAccessClientDetails: false,
          isAdmin: false,
        }
      },
      {
        id: 'booster3',
        name: 'EliteBoost',
        avatar: 'https://i.pravatar.cc/150?u=booster3',
        email: 'elite@example.com',
        phone: '+1 555 123 4567',
        joinDate: new Date(2022, 10, 5),
        status: 'offline',
        completedOrders: 78,
        rating: 4.6,
        specialization: ['Solo Boost', 'Coaching'],
        permissions: {
          canAccessChat: true,
          canModifyOrders: true,
          canAccessClientDetails: false,
          isAdmin: false,
        }
      },
      {
        id: 'booster4',
        name: 'ProPlayer',
        avatar: 'https://i.pravatar.cc/150?u=booster4',
        email: 'proplayer@example.com',
        phone: '+1 333 444 5555',
        joinDate: new Date(2020, 8, 12),
        status: 'banned',
        completedOrders: 412,
        rating: 3.2,
        specialization: ['Solo Boost', 'Duo Boost', 'Coaching', 'Placement Matches'],
        permissions: {
          canAccessChat: false,
          canModifyOrders: false,
          canAccessClientDetails: false,
          isAdmin: false,
        }
      },
    ];
    
    setBoosters(mockBoosters);
    setFilteredBoosters(mockBoosters);
  }, []);
  
  // Filter boosters based on search and filter criteria
  useEffect(() => {
    let filtered = [...boosters];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(booster => 
        booster.name.toLowerCase().includes(query) ||
        booster.email.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booster => booster.status === statusFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'orders':
          comparison = a.completedOrders - b.completedOrders;
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredBoosters(filtered);
  }, [boosters, searchQuery, statusFilter, sortBy, sortDirection]);
  
  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'online':
        return '#2ecc71'; // green
      case 'away':
        return '#f39c12'; // amber
      case 'offline':
        return '#95a5a6'; // gray
      case 'banned':
        return '#e74c3c'; // red
      default:
        return '#95a5a6'; // gray
    }
  };
  
  const handleAddBooster = () => {
    setSelectedBooster(null);
    setShowAddBoosterModal(true);
  };
  
  const handleSaveBooster = (booster: Booster) => {
    if (booster.id && boosters.some(b => b.id === booster.id)) {
      // Editing existing booster
      setBoosters(prevBoosters => 
        prevBoosters.map(b => b.id === booster.id ? booster : b)
      );
    } else {
      // Adding new booster
      setBoosters(prevBoosters => [...prevBoosters, booster]);
    }
  };
  
  const editBooster = (id: string) => {
    const booster = boosters.find(b => b.id === id);
    if (booster) {
      setSelectedBooster(booster);
      setShowEditBoosterModal(true);
    }
  };
  
  const deleteBooster = (id: string) => {
    const booster = boosters.find(b => b.id === id);
    if (booster) {
      setSelectedBooster(booster);
      setShowDeleteModal(true);
    }
  };
  
  const handleDeleteBooster = (id: string) => {
    setBoosters(prevBoosters => prevBoosters.filter(b => b.id !== id));
  };
  
  const managePermissions = (id: string) => {
    const booster = boosters.find(b => b.id === id);
    if (booster) {
      setSelectedBooster(booster);
      setShowPermissionsModal(true);
    }
  };
  
  const handleUpdatePermissions = (boosterId: string, permissions: Booster['permissions']) => {
    setBoosters(prevBoosters => 
      prevBoosters.map(b => 
        b.id === boosterId 
          ? {...b, permissions} 
          : b
      )
    );
  };
  
  const toggleBoosterStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'banned' ? 'offline' : 'banned';
    setBoosters(prevBoosters => 
      prevBoosters.map(b => 
        b.id === id 
          ? {...b, status: newStatus as 'online' | 'offline' | 'away' | 'banned'} 
          : b
      )
    );
  };
  
  const viewBoosterActivity = (id: string) => {
    const booster = boosters.find(b => b.id === id);
    if (booster) {
      setSelectedBooster(booster);
      setShowActivityModal(true);
    }
  };
  
  return (
    <Container>
      <PageHeader>
        <PageTitle>Booster Management</PageTitle>
        <PageDescription>
          Add, remove, and manage boosters and their permissions
        </PageDescription>
      </PageHeader>
      
      <ControlsWrapper>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput 
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </SearchContainer>
        
        <FiltersContainer>
          <FilterWrapper>
            <FilterIcon>
              <FaFilter />
            </FilterIcon>
            <FilterSelect
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
              <option value="banned">Banned</option>
            </FilterSelect>
          </FilterWrapper>
          
          <AddBoosterButton onClick={handleAddBooster}>
            <FaUserPlus />
            <span>Add Booster</span>
          </AddBoosterButton>
        </FiltersContainer>
      </ControlsWrapper>
      
      {/* Desktop Table View */}
      <DesktopView>
        <BoostersTable>
          <TableHeader>
            <HeaderCell width="5%" />
            <HeaderCell 
              width="20%" 
              onClick={() => handleSort('name')}
              $isSorted={sortBy === 'name'}
              $sortDirection={sortBy === 'name' ? sortDirection : 'asc'}
            >
              <div>
                Booster
                {sortBy === 'name' && <SortIcon $direction={sortDirection}><FaSort /></SortIcon>}
              </div>
            </HeaderCell>
            <HeaderCell width="15%">Contact Info</HeaderCell>
            <HeaderCell 
              width="10%" 
              onClick={() => handleSort('joinDate')}
              $isSorted={sortBy === 'joinDate'}
              $sortDirection={sortBy === 'joinDate' ? sortDirection : 'asc'}
            >
              <div>
                Join Date
                {sortBy === 'joinDate' && <SortIcon $direction={sortDirection}><FaSort /></SortIcon>}
              </div>
            </HeaderCell>
            <HeaderCell 
              width="10%" 
              onClick={() => handleSort('orders')}
              $isSorted={sortBy === 'orders'}
              $sortDirection={sortBy === 'orders' ? sortDirection : 'asc'}
            >
              <div>
                Orders
                {sortBy === 'orders' && <SortIcon $direction={sortDirection}><FaSort /></SortIcon>}
              </div>
            </HeaderCell>
            <HeaderCell 
              width="10%" 
              onClick={() => handleSort('rating')}
              $isSorted={sortBy === 'rating'}
              $sortDirection={sortBy === 'rating' ? sortDirection : 'asc'}
            >
              <div>
                Rating
                {sortBy === 'rating' && <SortIcon $direction={sortDirection}><FaSort /></SortIcon>}
              </div>
            </HeaderCell>
            <HeaderCell width="15%">Specialization</HeaderCell>
            <HeaderCell width="15%">Actions</HeaderCell>
          </TableHeader>
          
          <TableBody>
            {filteredBoosters.length > 0 ? (
              filteredBoosters.map(booster => (
                <TableRow key={booster.id}>
                  <TableCell width="5%">
                    <StatusDot $status={booster.status} />
                  </TableCell>
                  
                  <TableCell width="20%">
                    <BoosterInfoCell>
                      <BoosterAvatar>
                        <img src={booster.avatar} alt={booster.name} />
                      </BoosterAvatar>
                      <BoosterName>{booster.name}</BoosterName>
                    </BoosterInfoCell>
                  </TableCell>
                  
                  <TableCell width="15%">
                    <ContactInfoCell>
                      <ContactItem>{booster.email}</ContactItem>
                      <ContactItem>{booster.phone}</ContactItem>
                    </ContactInfoCell>
                  </TableCell>
                  
                  <TableCell width="10%">
                    {formatDate(booster.joinDate)}
                  </TableCell>
                  
                  <TableCell width="10%">
                    {booster.completedOrders}
                  </TableCell>
                  
                  <TableCell width="10%">
                    <RatingDisplay $rating={booster.rating}>
                      {booster.rating.toFixed(1)}
                      <RatingStar>★</RatingStar>
                    </RatingDisplay>
                  </TableCell>
                  
                  <TableCell width="15%">
                    <SpecializationCell>
                      {booster.specialization.map((spec, index) => (
                        <SpecTag key={index}>{spec}</SpecTag>
                      ))}
                    </SpecializationCell>
                  </TableCell>
                  
                  <TableCell width="15%">
                    <ActionsCell>
                      <ActionButton onClick={() => editBooster(booster.id)} title="Edit booster">
                        <FaEdit />
                      </ActionButton>
                      
                      <ActionButton onClick={() => managePermissions(booster.id)} title="Manage permissions">
                        <FaKey />
                      </ActionButton>
                      
                      <ActionButton onClick={() => viewBoosterActivity(booster.id)} title="View activity">
                        <FaEye />
                      </ActionButton>
                      
                      <ActionButton 
                        onClick={() => toggleBoosterStatus(booster.id, booster.status)} 
                        title={booster.status === 'banned' ? 'Unban booster' : 'Ban booster'}
                        $warning={booster.status !== 'banned'}
                        $success={booster.status === 'banned'}
                      >
                        {booster.status === 'banned' ? <FaCheck /> : <FaUserSlash />}
                      </ActionButton>
                      
                      <ActionButton 
                        onClick={() => deleteBooster(booster.id)} 
                        title="Delete booster"
                        $danger
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionsCell>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <EmptyRow>
                <EmptyCell colSpan={8}>
                  <EmptyMessage>No boosters found matching your criteria</EmptyMessage>
                </EmptyCell>
              </EmptyRow>
            )}
          </TableBody>
        </BoostersTable>
      </DesktopView>
      
      {/* Mobile Card View */}
      <MobileView>
        {filteredBoosters.length > 0 ? (
          <BoosterCardList>
            {filteredBoosters.map(booster => (
              <BoosterCard key={booster.id}>
                <CardHeader $status={booster.status}>
                  <CardHeaderContent>
                    <BoosterAvatar>
                      <img src={booster.avatar} alt={booster.name} />
                    </BoosterAvatar>
                    <BoosterInfo>
                      <BoosterName>{booster.name}</BoosterName>
                      <StatusBadge $status={booster.status}>
                        {booster.status.charAt(0).toUpperCase() + booster.status.slice(1)}
                      </StatusBadge>
                    </BoosterInfo>
                  </CardHeaderContent>
                </CardHeader>
                
                <CardBody>
                  <CardSection>
                    <SectionLabel>Contact</SectionLabel>
                    <ContactInfoCell>
                      <ContactItem>{booster.email}</ContactItem>
                      <ContactItem>{booster.phone}</ContactItem>
                    </ContactInfoCell>
                  </CardSection>
                  
                  <CardRow>
                    <CardColumn>
                      <SectionLabel>Join Date</SectionLabel>
                      <SectionValue>{formatDate(booster.joinDate)}</SectionValue>
                    </CardColumn>
                    <CardColumn>
                      <SectionLabel>Orders</SectionLabel>
                      <SectionValue>{booster.completedOrders}</SectionValue>
                    </CardColumn>
                    <CardColumn>
                      <SectionLabel>Rating</SectionLabel>
                      <RatingDisplay $rating={booster.rating}>
                        {booster.rating.toFixed(1)}
                        <RatingStar>★</RatingStar>
                      </RatingDisplay>
                    </CardColumn>
                  </CardRow>
                  
                  <CardSection>
                    <SectionLabel>Specialization</SectionLabel>
                    <SpecializationCell>
                      {booster.specialization.map((spec, index) => (
                        <SpecTag key={index}>{spec}</SpecTag>
                      ))}
                    </SpecializationCell>
                  </CardSection>
                </CardBody>
                
                <CardFooter>
                  <ActionButton onClick={() => editBooster(booster.id)} title="Edit">
                    <FaEdit />
                  </ActionButton>
                  
                  <ActionButton onClick={() => managePermissions(booster.id)} title="Permissions">
                    <FaKey />
                  </ActionButton>
                  
                  <ActionButton onClick={() => viewBoosterActivity(booster.id)} title="Activity">
                    <FaEye />
                  </ActionButton>
                  
                  <ActionButton 
                    onClick={() => toggleBoosterStatus(booster.id, booster.status)} 
                    title={booster.status === 'banned' ? 'Unban' : 'Ban'}
                    $warning={booster.status !== 'banned'}
                    $success={booster.status === 'banned'}
                  >
                    {booster.status === 'banned' ? <FaCheck /> : <FaUserSlash />}
                  </ActionButton>
                  
                  <ActionButton 
                    onClick={() => deleteBooster(booster.id)} 
                    title="Delete"
                    $danger
                  >
                    <FaTrash />
                  </ActionButton>
                </CardFooter>
              </BoosterCard>
            ))}
          </BoosterCardList>
        ) : (
          <EmptyMessage>No boosters found matching your criteria</EmptyMessage>
        )}
      </MobileView>
      
      {showAddBoosterModal && (
        <BoosterFormModal
          isOpen={showAddBoosterModal}
          onClose={() => setShowAddBoosterModal(false)}
          onSave={handleSaveBooster}
          booster={null}
          isEditing={false}
        />
      )}
      
      {showEditBoosterModal && selectedBooster && (
        <BoosterFormModal
          isOpen={showEditBoosterModal}
          onClose={() => setShowEditBoosterModal(false)}
          onSave={handleSaveBooster}
          booster={selectedBooster}
          isEditing={true}
        />
      )}
      
      {showPermissionsModal && selectedBooster && (
        <BoosterPermissionsModal
          isOpen={showPermissionsModal}
          onClose={() => setShowPermissionsModal(false)}
          onSave={handleUpdatePermissions}
          booster={selectedBooster}
        />
      )}
      
      {showActivityModal && selectedBooster && (
        <BoosterActivityModal
          isOpen={showActivityModal}
          onClose={() => setShowActivityModal(false)}
          booster={selectedBooster}
        />
      )}
      
      {showDeleteModal && selectedBooster && (
        <DeleteBoosterModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteBooster}
          booster={selectedBooster}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  max-width: 100%;
  overflow-x: hidden;
`;

const PageHeader = styled.div`
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.text}aa;
`;

const ControlsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  
  @media (min-width: 768px) {
    max-width: 400px;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text}aa;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}22;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  width: 100%;
  
  @media (min-width: 768px) {
    width: auto;
  }
`;

const FilterWrapper = styled.div`
  position: relative;
  flex: 1;
  
  @media (min-width: 768px) {
    flex: 0 1 auto;
    min-width: 160px;
  }
`;

const FilterIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.text}aa;
  pointer-events: none;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.cardBg};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-size: 0.95rem;
  appearance: none;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.primary}22;
  }
  
  &::-ms-expand {
    display: none;
  }
  
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23888' viewBox='0 0 16 16'%3E%3Cpath d='M8 10.5l-4-4h8l-4 4z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
`;

const AddBoosterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0 1rem;
  height: 2.75rem;
  border-radius: 0.5rem;
  border: none;
  background-color: ${({ theme }) => theme.primary};
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  font-weight: 500;
  font-size: 0.95rem;
  
  &:hover {
    background-color: ${({ theme }) => theme.buttonHover || theme.primary + 'dd'};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 480px) {
    flex: 1;
  }
`;

const DesktopView = styled.div`
  display: none;
  
  @media (min-width: 992px) {
    display: block;
  }
`;

const MobileView = styled.div`
  display: block;
  padding: 0 0.5rem;
  
  @media (min-width: 992px) {
    display: none;
  }
`;

const BoostersTable = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.05);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
`;

const TableHeader = styled.div`
  display: flex;
  padding: 1rem;
  background-color: ${({ theme }) => theme.hover};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  font-weight: 600;
`;

const HeaderCell = styled.div<{ width: string, $isSorted?: boolean, $sortDirection?: 'asc' | 'desc' }>`
  flex: ${({ width }) => `0 0 ${width}`};
  padding: 0.75rem 0.5rem;
  font-size: 0.9rem;
  color: ${({ $isSorted, theme }) => $isSorted ? theme.primary : theme.text};
  
  div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
  }
`;

const SortIcon = styled.span<{ $direction: 'asc' | 'desc' }>`
  transform: ${({ $direction }) => $direction === 'asc' ? 'rotate(0deg)' : 'rotate(180deg)'};
  transition: transform 0.3s ease;
`;

const TableBody = styled.div``;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  transition: background-color 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.hover};
  }
`;

const TableCell = styled.div<{ width: string }>`
  flex: ${({ width }) => `0 0 ${width}`};
  padding: 0.5rem;
  display: flex;
  align-items: center;
`;

const StatusDot = styled.div<{ $status: string }>`
  display: inline-block;
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: ${({ $status }) => {
    switch($status) {
      case 'online': return '#2ecc71'; // green
      case 'away': return '#f39c12'; // amber
      case 'offline': return '#95a5a6'; // gray
      case 'banned': return '#e74c3c'; // red
      default: return '#95a5a6'; // gray
    }
  }};
  box-shadow: 0 0 5px ${({ $status }) => {
    switch($status) {
      case 'online': return '#2ecc7188'; 
      case 'away': return '#f39c1288'; 
      case 'offline': return '#95a5a688'; 
      case 'banned': return '#e74c3c88'; 
      default: return '#95a5a688'; 
    }
  }};
`;

const StatusBadge = styled.div<{ $status: string }>`
  display: inline-block;
  padding: 0.25rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  background-color: ${({ $status }) => {
    switch($status) {
      case 'online': return '#2ecc7133';
      case 'away': return '#f39c1233';
      case 'offline': return '#95a5a633';
      case 'banned': return '#e74c3c33';
      default: return '#95a5a633';
    }
  }};
  color: ${({ $status }) => {
    switch($status) {
      case 'online': return '#2ecc71';
      case 'away': return '#f39c12';
      case 'offline': return '#95a5a6';
      case 'banned': return '#e74c3c';
      default: return '#95a5a6';
    }
  }};
`;

const BoosterInfoCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const BoosterAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid ${({ theme }) => theme.border};
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BoosterName = styled.div`
  font-weight: 600;
  font-size: 1rem;
`;

const ContactInfoCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const ContactItem = styled.div`
  font-size: 0.85rem;
  overflow: hidden;
  text-overflow: ellipsis;
  
  &:first-child {
    color: ${({ theme }) => theme.primary};
  }
`;

const RatingDisplay = styled.div<{ $rating: number }>`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  color: ${({ $rating }) => 
    $rating >= 4.5 ? '#2ecc71' : 
    $rating >= 4.0 ? '#27ae60' : 
    $rating >= 3.5 ? '#f39c12' : 
    $rating >= 3.0 ? '#e67e22' : 
    '#e74c3c'
  };
`;

const RatingStar = styled.span`
  color: gold;
  text-shadow: 0 0 1px rgba(0, 0, 0, 0.3);
`;

const SpecializationCell = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
`;

const SpecTag = styled.div`
  background-color: ${({ theme }) => theme.primary}22;
  color: ${({ theme }) => theme.primary};
  padding: 0.15rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
`;

const ActionsCell = styled.div`
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ActionButton = styled.button<{ $danger?: boolean, $warning?: boolean, $success?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.35rem;
  border: none;
  background-color: ${({ $danger, $warning, $success, theme }) => 
    $danger ? '#ff4d4d22' : 
    $warning ? '#f39c1222' : 
    $success ? '#2ecc7122' :
    theme.hover};
  color: ${({ $danger, $warning, $success, theme }) => 
    $danger ? '#ff4d4d' : 
    $warning ? '#f39c12' : 
    $success ? '#2ecc71' :
    theme.text};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ $danger, $warning, $success, theme }) => 
      $danger ? '#ff4d4d33' : 
      $warning ? '#f39c1233' : 
      $success ? '#2ecc7133' :
      `${theme.hover}cc`};
    transform: translateY(-2px);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const EmptyRow = styled.div`
  padding: 2rem;
`;

const EmptyCell = styled.div<{ colSpan?: number }>`
  width: 100%;
  text-align: center;
`;

const EmptyMessage = styled.div`
  color: ${({ theme }) => theme.text}aa;
  font-size: 1.1rem;
  text-align: center;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.hover};
  border-radius: 0.5rem;
`;

// Mobile card view components
const BoosterCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BoosterCard = styled.div`
  background-color: ${({ theme }) => theme.cardBg};
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid ${({ theme }) => theme.border};
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }
`;

const CardHeader = styled.div<{ $status: string }>`
  padding: 1rem;
  background-color: ${({ $status }) => {
    switch($status) {
      case 'online': return '#2ecc7111';
      case 'away': return '#f39c1211';
      case 'offline': return '#95a5a611';
      case 'banned': return '#e74c3c11';
      default: return 'transparent';
    }
  }};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const CardHeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const BoosterInfo = styled.div`
  flex: 1;
`;

const CardBody = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CardRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const CardColumn = styled.div`
  flex: 1;
  min-width: 80px;
`;

const SectionLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${({ theme }) => theme.text}aa;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const SectionValue = styled.div`
  font-weight: 500;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.hover};
  border-top: 1px solid ${({ theme }) => theme.border};
  gap: 0.5rem;
`;

export default DashboardOwnerBoosterManagement; 