import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Input, Select, Button, Toggle, Skeleton, Pagination } from '../components/common';
import type { Alert } from '../types';

const AlertsContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
  
  ${mediaQueries.mobile} {
    padding: ${theme.spacing.md};
  }
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text};
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: ${theme.spacing.lg};
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PageDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 1.1rem;
  line-height: 1.6;
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const Section = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.xl};
`;

const SectionHeader = styled.div`
  margin-bottom: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 ${theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SectionDescription = styled.p`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  margin: 0;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  align-items: end;
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.md};
  }
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  
  ${mediaQueries.mobile} {
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  min-width: 120px;
`;

const FilterLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const AlertsList = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
`;

const AlertsListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
`;

const AlertsCount = styled.span`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
`;

const AlertItem = styled.div<{ type: 'buy' | 'sell' | 'warning' | 'info' }>`
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 100px 100px 80px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  transition: all 0.2s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${props => {
      switch (props.type) {
        case 'buy': return theme.colors.success;
        case 'sell': return theme.colors.error;
        case 'warning': return theme.colors.warning;
        case 'info': return theme.colors.primary;
        default: return theme.colors.border;
      }
    }};
  }
  
  &:hover {
    background-color: rgba(229, 9, 20, 0.02);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md};
  }
`;

const AlertIcon = styled.div<{ type: 'buy' | 'sell' | 'warning' | 'info' }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${props => {
    switch (props.type) {
      case 'buy': return 'rgba(0, 212, 170, 0.1)';
      case 'sell': return 'rgba(229, 9, 20, 0.1)';
      case 'warning': return 'rgba(255, 193, 7, 0.1)';
      case 'info': return 'rgba(229, 9, 20, 0.1)';
      default: return theme.colors.background;
    }
  }};
  color: ${props => {
    switch (props.type) {
      case 'buy': return theme.colors.success;
      case 'sell': return theme.colors.error;
      case 'warning': return theme.colors.warning;
      case 'info': return theme.colors.primary;
      default: return theme.colors.textSecondary;
    }
  }};
`;

const AlertContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const AlertTitle = styled.div`
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 0.9rem;
  line-height: 1.2;
`;

const AlertMessage = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
  line-height: 1.3;
`;

const AlertCoin = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 0.9rem;
`;

const AlertPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  color: ${theme.colors.text};
  font-size: 0.9rem;
`;

const AlertStrength = styled.div<{ strength: 'low' | 'medium' | 'high' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.strength) {
      case 'high':
        return `
          color: ${theme.colors.error};
          background-color: rgba(229, 9, 20, 0.1);
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          border-radius: ${theme.borderRadius.sm};
        `;
      case 'medium':
        return `
          color: ${theme.colors.warning};
          background-color: rgba(255, 193, 7, 0.1);
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          border-radius: ${theme.borderRadius.sm};
        `;
      case 'low':
        return `
          color: ${theme.colors.success};
          background-color: rgba(0, 212, 170, 0.1);
          padding: ${theme.spacing.xs} ${theme.spacing.sm};
          border-radius: ${theme.borderRadius.sm};
        `;
    }
  }}
`;

const AlertTime = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textSecondary};
  font-size: 0.8rem;
`;

const AlertActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing.xs};
`;

const ActionButton = styled(Button)`
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  font-size: 0.8rem;
  min-width: auto;
`;

const AlertSettingsForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${theme.colors.text};
`;

const FormRow = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  align-items: end;
  
  ${mediaQueries.mobile} {
    flex-direction: column;
    gap: ${theme.spacing.sm};
  }
`;

const SaveButton = styled(Button)`
  grid-column: 1 / -1;
  justify-self: center;
  min-width: 200px;
  margin-top: ${theme.spacing.md};
`;

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.lg};
`;

const StatCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
  text-align: center;
`;

const StatValue = styled.div<{ isPositive?: boolean }>`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.isPositive ? theme.colors.success : theme.colors.error};
  margin-bottom: ${theme.spacing.sm};
`;

const StatLabel = styled.div`
  color: ${theme.colors.textSecondary};
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const TestSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const TestCard = styled.div`
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  padding: ${theme.spacing.lg};
`;

const TestHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.md};
`;

const TestTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const TestButton = styled(Button)`
  min-width: 120px;
`;

const TestResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  margin-top: ${theme.spacing.md};
`;

const TestResult = styled.div<{ success: boolean }>`
  padding: ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.success ? 'rgba(0, 212, 170, 0.1)' : 'rgba(229, 9, 20, 0.1)'};
  border: 1px solid ${props => props.success ? theme.colors.success : theme.colors.error};
  color: ${props => props.success ? theme.colors.success : theme.colors.error};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const SuccessMessage = styled.div`
  background-color: rgba(0, 212, 170, 0.1);
  border: 1px solid ${theme.colors.success};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.success};
  font-weight: 500;
  margin-bottom: ${theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  background-color: rgba(229, 9, 20, 0.1);
  border: 1px solid ${theme.colors.error};
  border-radius: ${theme.borderRadius.sm};
  padding: ${theme.spacing.md};
  color: ${theme.colors.error};
  font-weight: 500;
  margin-bottom: ${theme.spacing.lg};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${theme.spacing.xl};
  color: ${theme.colors.textSecondary};
  font-style: italic;
`;

const SkeletonRow = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr 120px 120px 100px 100px 80px;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  
  ${mediaQueries.mobile} {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.sm};
    padding: ${theme.spacing.md};
  }
`;

const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'buy' | 'sell' | 'warning' | 'info'>('all');
  const [filterStrength, setFilterStrength] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [testResults, setTestResults] = useState<{ channel: string; success: boolean; message: string }[]>([]);
  
  const itemsPerPage = 10;
  
  // Mock alerts data
  const mockAlerts: Alert[] = [
    {
      _id: '1',
      type: 'buy',
      title: '강력한 매수 신호',
      message: 'BTC가 지지선을 터치하고 반등 신호가 감지되었습니다.',
      coin: 'BTC',
      price: 43250.50,
      strength: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      isRead: false,
      channels: ['push', 'email']
    },
    {
      _id: '2',
      type: 'sell',
      title: '매도 신호 감지',
      message: 'ETH가 저항선에서 거부당하며 하락 신호가 나타났습니다.',
      coin: 'ETH',
      price: 2650.75,
      strength: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      isRead: false,
      channels: ['push']
    },
    {
      _id: '3',
      type: 'warning',
      title: '변동성 증가 경고',
      message: '시장 변동성이 급격히 증가하고 있습니다. 포지션을 점검하세요.',
      coin: 'ALL',
      price: 0,
      strength: 'high',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      isRead: true,
      channels: ['email', 'discord']
    },
    {
      _id: '4',
      type: 'info',
      title: '김치 프리미엄 알림',
      message: 'BTC 김치 프리미엄이 3%를 넘어섰습니다.',
      coin: 'BTC',
      price: 43250.50,
      strength: 'low',
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      isRead: true,
      channels: ['push', 'email']
    },
    {
      _id: '5',
      type: 'buy',
      title: '돌파 신호',
      message: 'ADA가 주요 저항선을 돌파했습니다.',
      coin: 'ADA',
      price: 0.485,
      strength: 'medium',
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      isRead: true,
      channels: ['push']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAlerts(mockAlerts);
      setFilteredAlerts(mockAlerts);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...alerts];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(alert => 
        alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.coin.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(alert => alert.type === filterType);
    }
    
    // Apply strength filter
    if (filterStrength !== 'all') {
      filtered = filtered.filter(alert => alert.strength === filterStrength);
    }
    
    setFilteredAlerts(filtered);
    setCurrentPage(1);
  }, [alerts, searchTerm, filterType, filterStrength]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTestAlerts = async () => {
    setTestResults([]);
    
    const channels = ['push', 'email', 'discord'];
    const results = [];
    
    for (const channel of channels) {
      // Simulate test
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = Math.random() > 0.2; // 80% success rate
      results.push({
        channel,
        success,
        message: success 
          ? `${channel} 알림이 성공적으로 전송되었습니다.`
          : `${channel} 알림 전송에 실패했습니다. 설정을 확인해주세요.`
      });
    }
    
    setTestResults(results);
  };

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert._id === alertId ? { ...alert, isRead: true } : alert
    ));
  };

  const handleDeleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert._id !== alertId));
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'buy': return '📈';
      case 'sell': return '📉';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getAlertTypeName = (type: string) => {
    switch (type) {
      case 'buy': return '매수';
      case 'sell': return '매도';
      case 'warning': return '경고';
      case 'info': return '정보';
      default: return '알림';
    }
  };

  const getStrengthName = (strength: string) => {
    switch (strength) {
      case 'high': return '높음';
      case 'medium': return '중간';
      case 'low': return '낮음';
      default: return '알 수 없음';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return '방금 전';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}분 전`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}시간 전`;
    return `${Math.floor(diff / 86400000)}일 전`;
  };

  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);

  return (
    <AlertsContainer>
      <PageHeader>
        <PageTitle>🔔 알림 센터</PageTitle>
        <PageDescription>
          중요한 투자 신호와 시장 변화를 실시간으로 받아보세요. 
          개인화된 알림 설정으로 놓치지 말고 투자 기회를 잡으세요.
        </PageDescription>
      </PageHeader>

      <MainContent>
        {/* Alert Statistics */}
        <Section>
          <SectionHeader>
            <SectionTitle>📊 알림 통계</SectionTitle>
            <SectionDescription>
              최근 7일간의 알림 성과와 반응률을 확인하세요.
            </SectionDescription>
          </SectionHeader>

          <StatisticsGrid>
            <StatCard>
              <StatValue isPositive={true}>127</StatValue>
              <StatLabel>총 알림 수</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>89.2%</StatValue>
              <StatLabel>성공률</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>2.3분</StatValue>
              <StatLabel>평균 응답 시간</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue isPositive={true}>94.7%</StatLabel>
              <StatLabel>전송 성공률</StatLabel>
            </StatCard>
          </StatisticsGrid>
        </Section>

        {/* Alert List */}
        <Section>
          <SectionHeader>
            <SectionTitle>📋 알림 리스트</SectionTitle>
            <SectionDescription>
              최근 받은 알림들을 확인하고 관리하세요.
            </SectionDescription>
          </SectionHeader>

          {showSuccess && (
            <SuccessMessage>
              ✅ 알림이 성공적으로 삭제되었습니다!
            </SuccessMessage>
          )}

          {showError && (
            <ErrorMessage>
              ❌ {errorMessage}
            </ErrorMessage>
          )}

          <ControlsSection>
            <SearchContainer>
              <Input
                placeholder="알림 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon="🔍"
                fullWidth
              />
            </SearchContainer>
            
            <FilterContainer>
              <FilterGroup>
                <FilterLabel>알림 유형</FilterLabel>
                <Select
                  options={[
                    { value: 'all', label: '전체' },
                    { value: 'buy', label: '매수' },
                    { value: 'sell', label: '매도' },
                    { value: 'warning', label: '경고' },
                    { value: 'info', label: '정보' },
                  ]}
                  value={filterType}
                  onChange={(value) => setFilterType(value as any)}
                  size="sm"
                />
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel>신호 강도</FilterLabel>
                <Select
                  options={[
                    { value: 'all', label: '전체' },
                    { value: 'high', label: '높음' },
                    { value: 'medium', label: '중간' },
                    { value: 'low', label: '낮음' },
                  ]}
                  value={filterStrength}
                  onChange={(value) => setFilterStrength(value as any)}
                  size="sm"
                />
              </FilterGroup>
            </FilterContainer>
          </ControlsSection>

          <AlertsListHeader>
            <AlertsCount>
              {isLoading ? '로딩 중...' : `${filteredAlerts.length}개 알림`}
            </AlertsCount>
          </AlertsListHeader>
          
          <AlertsList>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <SkeletonRow key={index}>
                  <Skeleton width="40px" height="40px" borderRadius="50%" />
                  <div>
                    <Skeleton width="150px" height="16px" />
                    <Skeleton width="200px" height="12px" />
                  </div>
                  <Skeleton width="60px" height="16px" />
                  <Skeleton width="80px" height="16px" />
                  <Skeleton width="60px" height="16px" />
                  <Skeleton width="60px" height="16px" />
                  <Skeleton width="40px" height="16px" />
                </SkeletonRow>
              ))
            ) : paginatedAlerts.length > 0 ? (
              paginatedAlerts.map((alert) => (
                <AlertItem key={alert._id} type={alert.type}>
                  <AlertIcon type={alert.type}>
                    {getAlertIcon(alert.type)}
                  </AlertIcon>
                  
                  <AlertContent>
                    <AlertTitle>{alert.title}</AlertTitle>
                    <AlertMessage>{alert.message}</AlertMessage>
                  </AlertContent>
                  
                  <AlertCoin>{alert.coin}</AlertCoin>
                  
                  <AlertPrice>
                    {alert.price > 0 ? `$${alert.price.toLocaleString()}` : '-'}
                  </AlertPrice>
                  
                  <AlertStrength strength={alert.strength}>
                    {getStrengthName(alert.strength)}
                  </AlertStrength>
                  
                  <AlertTime>
                    {formatTime(alert.timestamp)}
                  </AlertTime>
                  
                  <AlertActions>
                    {!alert.isRead && (
                      <ActionButton
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(alert._id)}
                      >
                        읽음
                      </ActionButton>
                    )}
                    <ActionButton
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteAlert(alert._id)}
                    >
                      삭제
                    </ActionButton>
                  </AlertActions>
                </AlertItem>
              ))
            ) : (
              <EmptyState>
                검색 조건에 맞는 알림이 없습니다.
              </EmptyState>
            )}
          </AlertsList>
          
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </Section>

        {/* Alert Settings */}
        <Section>
          <SectionHeader>
            <SectionTitle>⚙️ 알림 설정</SectionTitle>
            <SectionDescription>
              알림 유형과 전송 방식을 개인화하세요.
            </SectionDescription>
          </SectionHeader>

          <AlertSettingsForm>
            <FormGroup>
              <FormLabel>알림 유형</FormLabel>
              <Toggle
                label="매수 신호 알림"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="매도 신호 알림"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="경고 알림"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="정보 알림"
                checked={false}
                onChange={() => {}}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>신호 강도 필터</FormLabel>
              <Toggle
                label="높은 강도만"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="중간 강도"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="낮은 강도"
                checked={false}
                onChange={() => {}}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>알림 채널</FormLabel>
              <Toggle
                label="푸시 알림"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="이메일 알림"
                checked={true}
                onChange={() => {}}
              />
              <Toggle
                label="Discord 알림"
                checked={false}
                onChange={() => {}}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>알림 빈도</FormLabel>
              <Select
                options={[
                  { value: 'immediate', label: '즉시' },
                  { value: 'hourly', label: '시간별' },
                  { value: 'daily', label: '일별' },
                ]}
                value="immediate"
                onChange={() => {}}
                fullWidth
              />
            </FormGroup>

            <SaveButton type="submit">
              설정 저장
            </SaveButton>
          </AlertSettingsForm>
        </Section>

        {/* Alert Test */}
        <Section>
          <SectionHeader>
            <SectionTitle>🧪 알림 테스트</SectionTitle>
            <SectionDescription>
              설정한 알림 채널이 정상적으로 작동하는지 테스트하세요.
            </SectionDescription>
          </SectionHeader>

          <TestSection>
            <TestCard>
              <TestHeader>
                <TestTitle>
                  🔔 알림 채널 테스트
                </TestTitle>
                <TestButton onClick={handleTestAlerts}>
                  테스트 실행
                </TestButton>
              </TestHeader>
              
              {testResults.length > 0 && (
                <TestResults>
                  {testResults.map((result, index) => (
                    <TestResult key={index} success={result.success}>
                      {result.success ? '✅' : '❌'} {result.message}
                    </TestResult>
                  ))}
                </TestResults>
              )}
            </TestCard>
          </TestSection>
        </Section>
      </MainContent>
    </AlertsContainer>
  );
};

export default Alerts;