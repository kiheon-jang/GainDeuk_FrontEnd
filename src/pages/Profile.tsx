import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../styles/theme';
import { Input, Select, Button, Checkbox, Toggle, Skeleton, SEOHead } from '../components/common';
import { createPageSEOMeta, createWebPageStructuredData } from '../utils/seoUtils';
// import { usePersonalizedRecommendations } from '../hooks';
import type { UserProfile } from '../types';

const ProfileContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 800px;
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

const FormContainer = styled.form`
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

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
  
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

const RiskSlider = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const SliderContainer = styled.div`
  position: relative;
  height: 8px;
  background-color: ${theme.colors.border};
  border-radius: 4px;
  margin: ${theme.spacing.md} 0;
`;

const SliderTrack = styled.div<{ value: number }>`
  height: 100%;
  background: linear-gradient(90deg, ${theme.colors.error} 0%, ${theme.colors.warning} 50%, ${theme.colors.success} 100%);
  border-radius: 4px;
  width: ${props => props.value}%;
  transition: width 0.3s ease;
`;

const SliderThumb = styled.div<{ value: number }>`
  position: absolute;
  top: 50%;
  left: ${props => props.value}%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: white;
  border: 2px solid ${theme.colors.primary};
  border-radius: 50%;
  cursor: pointer;
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SliderValue = styled.div`
  text-align: center;
  font-weight: 600;
  color: ${theme.colors.text};
  font-size: 1.1rem;
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.sm};
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const NotificationSettings = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const NotificationGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
`;

const NotificationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const NotificationIcon = styled.div`
  font-size: 1.5rem;
`;

const NotificationTitle = styled.h3`
  color: ${theme.colors.text};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
`;

const NotificationOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.md};
`;

const NotificationRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NotificationLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
`;

const NotificationName = styled.span`
  font-weight: 500;
  color: ${theme.colors.text};
`;

const NotificationDesc = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

const PortfolioSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const PortfolioItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
`;

const PortfolioInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
`;

const PortfolioIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.secondary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
  color: ${theme.colors.text};
`;

const PortfolioDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const PortfolioName = styled.span`
  font-weight: 600;
  color: ${theme.colors.text};
`;

const PortfolioAmount = styled.span`
  font-size: 0.8rem;
  color: ${theme.colors.textSecondary};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${theme.spacing.xl};
  padding-top: ${theme.spacing.lg};
  border-top: 1px solid ${theme.colors.border};
  
  ${mediaQueries.mobile} {
    flex-direction: column;
  }
`;

const SaveButton = styled(Button)`
  min-width: 120px;
`;

const CancelButton = styled(Button)`
  min-width: 120px;
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

const Profile: React.FC = () => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // SEO 메타데이터 생성
  const seoMeta = createPageSEOMeta('profile');
  const structuredData = createWebPageStructuredData(
    seoMeta.title,
    seoMeta.description,
    'https://gaindeuk.com/profile',
    [
      { name: '홈', url: 'https://gaindeuk.com/' },
      { name: '프로필', url: 'https://gaindeuk.com/profile' }
    ]
  );

  // Mock user ID - in real app, this would come from auth context
  // const userId = 'user123';

  // Fetch user profile data - Mock data for now
  const userProfile = { data: {} };
  const profileLoading = false;
  // const { data: recommendations } = usePersonalizedRecommendations(userId);

  useEffect(() => {
    if (userProfile?.data) {
      setFormData(userProfile.data);
      setIsLoading(false);
    }
  }, [userProfile]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRiskToleranceChange = (value: number) => {
    setFormData(prev => ({
      ...prev,
      riskTolerance: value
    }));
  };

  const handleNotificationChange = (type: string, field: string, value: any) => {
    setFormData(prev => {
      const currentSettings = prev.notificationSettings || {};
      const currentTypeSettings = (currentSettings as any)[type] || {};
      
      return {
        ...prev,
        notificationSettings: {
          ...currentSettings,
          [type]: {
            ...currentTypeSettings,
            [field]: value
          }
        } as any
      };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would be an actual API call
      console.log('Saving profile:', formData);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage('프로필 저장 중 오류가 발생했습니다.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (userProfile?.data) {
      setFormData(userProfile.data);
    }
    setShowSuccess(false);
    setShowError(false);
  };

  if (isLoading || profileLoading) {
    return (
      <ProfileContainer>
        <PageHeader>
          <Skeleton width="200px" height="32px" />
          <Skeleton width="400px" height="20px" />
        </PageHeader>
        <FormContainer>
          {Array.from({ length: 4 }).map((_, index) => (
            <Section key={index}>
              <Skeleton width="150px" height="24px" />
              <Skeleton width="300px" height="16px" />
              <Skeleton width="100%" height="200px" />
            </Section>
          ))}
        </FormContainer>
      </ProfileContainer>
    );
  }

  return (
    <>
      <SEOHead
        title={seoMeta.title}
        description={seoMeta.description}
        keywords={seoMeta.keywords}
        canonicalUrl="/profile"
        ogTitle={seoMeta.title}
        ogDescription={seoMeta.description}
        ogUrl="/profile"
        ogType={seoMeta.ogType}
        structuredData={structuredData}
      />
      <ProfileContainer>
      <PageHeader>
        <PageTitle>👤 프로필 설정</PageTitle>
        <PageDescription>
          개인화된 투자 경험을 위해 프로필을 설정하세요. 
          설정한 정보는 AI가 더 정확한 투자 신호를 제공하는 데 사용됩니다.
        </PageDescription>
      </PageHeader>

      <FormContainer onSubmit={handleSave}>
        {showSuccess && (
          <SuccessMessage>
            ✅ 프로필이 성공적으로 저장되었습니다!
          </SuccessMessage>
        )}

        {showError && (
          <ErrorMessage>
            ❌ {errorMessage}
          </ErrorMessage>
        )}

        {/* Investment Style Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>🎯 투자 스타일</SectionTitle>
            <SectionDescription>
              투자 경험과 선호도를 설정하여 맞춤형 신호를 받아보세요.
            </SectionDescription>
          </SectionHeader>

          <FormGrid>
            <FormGroup>
              <FormLabel>투자 스타일</FormLabel>
              <Select
                options={[
                  { value: 'conservative', label: '보수적 - 안정적인 수익 추구' },
                  { value: 'moderate', label: '중간 - 균형잡힌 투자' },
                  { value: 'aggressive', label: '공격적 - 높은 수익 추구' },
                  { value: 'speculative', label: '투기적 - 고위험 고수익' },
                ]}
                value={formData.investmentStyle || 'moderate'}
                onChange={(value) => handleInputChange('investmentStyle', value)}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>경험 수준</FormLabel>
              <Select
                options={[
                  { value: 'beginner', label: '초보자 - 1년 미만' },
                  { value: 'intermediate', label: '중급자 - 1-3년' },
                  { value: 'advanced', label: '고급자 - 3-5년' },
                  { value: 'expert', label: '전문가 - 5년 이상' },
                ]}
                value={formData.experienceLevel || 'beginner'}
                onChange={(value) => handleInputChange('experienceLevel', value)}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>거래 경험 (년)</FormLabel>
              <Input
                type="number"
                min="0"
                max="20"
                value={formData.tradingExperience || 0}
                onChange={(e) => handleInputChange('tradingExperience', parseInt(e.target.value))}
                fullWidth
              />
            </FormGroup>

            <FormGroup>
              <FormLabel>투자 가능 시간</FormLabel>
              <Select
                options={[
                  { value: 'minimal', label: '최소 - 주 1-2시간' },
                  { value: 'part-time', label: '파트타임 - 주 5-10시간' },
                  { value: 'full-time', label: '풀타임 - 주 20시간 이상' },
                ]}
                value={formData.availableTime || 'minimal'}
                onChange={(value) => handleInputChange('availableTime', value)}
                fullWidth
              />
            </FormGroup>
          </FormGrid>

          <RiskSlider>
            <FormLabel>위험 허용도 (1-10)</FormLabel>
            <SliderContainer>
              <SliderTrack value={(formData.riskTolerance || 5) * 10} />
              <SliderThumb 
                value={(formData.riskTolerance || 5) * 10}
                onClick={() => {
                  const newValue = (formData.riskTolerance || 5) === 10 ? 1 : (formData.riskTolerance || 5) + 1;
                  handleRiskToleranceChange(newValue);
                }}
              />
            </SliderContainer>
            <SliderValue>{formData.riskTolerance || 5} / 10</SliderValue>
            <SliderLabels>
              <span>매우 보수적</span>
              <span>매우 공격적</span>
            </SliderLabels>
          </RiskSlider>
        </Section>

        {/* Preferences Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>⚙️ 투자 선호도</SectionTitle>
            <SectionDescription>
              선호하는 투자 전략과 관심 코인을 설정하세요.
            </SectionDescription>
          </SectionHeader>

          <FormGrid>
            <FormGroup>
              <FormLabel>선호 타임프레임</FormLabel>
              <CheckboxGroup>
                {[
                  { value: 'SCALPING', label: '스캘핑 (분 단위)' },
                  { value: 'DAY_TRADING', label: '데이트레이딩 (일 단위)' },
                  { value: 'SWING_TRADING', label: '스윙 트레이딩 (주 단위)' },
                  { value: 'LONG_TERM', label: '장기 투자 (월 단위)' },
                ].map((timeframe) => (
                  <Checkbox
                    key={timeframe.value}
                    label={timeframe.label}
                    checked={formData.preferredTimeframes?.includes(timeframe.value) || false}
                    onChange={(e) => {
                      const current = formData.preferredTimeframes || [];
                      const updated = e.target.checked
                        ? [...current, timeframe.value]
                        : current.filter(t => t !== timeframe.value);
                      handleInputChange('preferredTimeframes', updated);
                    }}
                  />
                ))}
              </CheckboxGroup>
            </FormGroup>

            <FormGroup>
              <FormLabel>최대 포지션 크기 (USDT)</FormLabel>
              <Input
                type="number"
                min="0"
                step="100"
                value={formData.maxPositionSize || 1000}
                onChange={(e) => handleInputChange('maxPositionSize', parseFloat(e.target.value))}
                fullWidth
              />
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Notification Settings Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>🔔 알림 설정</SectionTitle>
            <SectionDescription>
              받고 싶은 알림의 종류와 방법을 설정하세요.
            </SectionDescription>
          </SectionHeader>

          <NotificationSettings>
            <NotificationGroup>
              <NotificationHeader>
                <NotificationIcon>📧</NotificationIcon>
                <NotificationTitle>이메일 알림</NotificationTitle>
              </NotificationHeader>
              <NotificationOptions>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>이메일 알림 활성화</NotificationName>
                    <NotificationDesc>중요한 신호와 시장 업데이트를 이메일로 받습니다</NotificationDesc>
                  </NotificationLabel>
                  <Toggle
                    checked={formData.notificationSettings?.email?.enabled || false}
                    onChange={(e) => handleNotificationChange('email', 'enabled', e.target.checked)}
                  />
                </NotificationRow>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>알림 빈도</NotificationName>
                    <NotificationDesc>이메일 알림을 받을 빈도를 설정합니다</NotificationDesc>
                  </NotificationLabel>
                  <Select
                    options={[
                      { value: 'immediate', label: '즉시' },
                      { value: 'hourly', label: '시간별' },
                      { value: 'daily', label: '일별' },
                      { value: 'weekly', label: '주별' },
                    ]}
                    value={formData.notificationSettings?.email?.frequency || 'daily'}
                    onChange={(value) => handleNotificationChange('email', 'frequency', value)}
                    size="sm"
                  />
                </NotificationRow>
              </NotificationOptions>
            </NotificationGroup>

            <NotificationGroup>
              <NotificationHeader>
                <NotificationIcon>📱</NotificationIcon>
                <NotificationTitle>푸시 알림</NotificationTitle>
              </NotificationHeader>
              <NotificationOptions>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>푸시 알림 활성화</NotificationName>
                    <NotificationDesc>모바일에서 즉시 알림을 받습니다</NotificationDesc>
                  </NotificationLabel>
                  <Toggle
                    checked={formData.notificationSettings?.push?.enabled || false}
                    onChange={(e) => handleNotificationChange('push', 'enabled', e.target.checked)}
                  />
                </NotificationRow>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>고우선순위만</NotificationName>
                    <NotificationDesc>중요한 신호만 푸시 알림을 받습니다</NotificationDesc>
                  </NotificationLabel>
                  <Toggle
                    checked={formData.notificationSettings?.push?.highPriorityOnly || false}
                    onChange={(e) => handleNotificationChange('push', 'highPriorityOnly', e.target.checked)}
                  />
                </NotificationRow>
              </NotificationOptions>
            </NotificationGroup>

            <NotificationGroup>
              <NotificationHeader>
                <NotificationIcon>💬</NotificationIcon>
                <NotificationTitle>Discord 알림</NotificationTitle>
              </NotificationHeader>
              <NotificationOptions>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>Discord 알림 활성화</NotificationName>
                    <NotificationDesc>Discord 웹훅을 통해 알림을 받습니다</NotificationDesc>
                  </NotificationLabel>
                  <Toggle
                    checked={formData.notificationSettings?.discord?.enabled || false}
                    onChange={(e) => handleNotificationChange('discord', 'enabled', e.target.checked)}
                  />
                </NotificationRow>
                <NotificationRow>
                  <NotificationLabel>
                    <NotificationName>웹훅 URL</NotificationName>
                    <NotificationDesc>Discord 웹훅 URL을 입력하세요</NotificationDesc>
                  </NotificationLabel>
                  <Input
                    type="url"
                    placeholder="https://discord.com/api/webhooks/..."
                    value={formData.notificationSettings?.discord?.webhookUrl || ''}
                    onChange={(e) => handleNotificationChange('discord', 'webhookUrl', e.target.value)}
                    fullWidth
                    size="sm"
                  />
                </NotificationRow>
              </NotificationOptions>
            </NotificationGroup>
          </NotificationSettings>
        </Section>

        {/* Portfolio Section */}
        <Section>
          <SectionHeader>
            <SectionTitle>💼 포트폴리오 관리</SectionTitle>
            <SectionDescription>
              현재 보유하고 있는 코인과 투자 이력을 관리하세요.
            </SectionDescription>
          </SectionHeader>

          <PortfolioSection>
            <FormRow>
              <Input
                placeholder="코인 심볼 (예: BTC)"
                fullWidth
              />
              <Input
                placeholder="보유량"
                type="number"
                size="sm"
              />
              <Button variant="outline" size="sm">
                추가
              </Button>
            </FormRow>

            {/* Mock portfolio items */}
            <PortfolioItem>
              <PortfolioInfo>
                <PortfolioIcon>B</PortfolioIcon>
                <PortfolioDetails>
                  <PortfolioName>Bitcoin (BTC)</PortfolioName>
                  <PortfolioAmount>0.5 BTC</PortfolioAmount>
                </PortfolioDetails>
              </PortfolioInfo>
              <Button variant="outline" size="sm">
                삭제
              </Button>
            </PortfolioItem>

            <PortfolioItem>
              <PortfolioInfo>
                <PortfolioIcon>E</PortfolioIcon>
                <PortfolioDetails>
                  <PortfolioName>Ethereum (ETH)</PortfolioName>
                  <PortfolioAmount>2.0 ETH</PortfolioAmount>
                </PortfolioDetails>
              </PortfolioInfo>
              <Button variant="outline" size="sm">
                삭제
              </Button>
            </PortfolioItem>
          </PortfolioSection>
        </Section>

        <ActionButtons>
          <CancelButton
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            취소
          </CancelButton>
          <SaveButton
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? '저장 중...' : '저장'}
          </SaveButton>
        </ActionButtons>
      </FormContainer>
      </ProfileContainer>
    </>
  );
};

export default Profile;
