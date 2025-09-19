import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { 
  AnimatedSection, 
  AnimatedLoader, 
  HoverEffect, 
  Button,
  PageTransition 
} from '../components/common';

const DemoContainer = styled.div`
  padding: ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;
`;

const DemoSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md};
  border: 1px solid ${theme.colors.border};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: ${theme.spacing.lg};
`;

const DemoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const DemoCard = styled.div`
  padding: ${theme.spacing.lg};
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.sm};
  border: 1px solid ${theme.colors.border};
  text-align: center;
`;

const ControlsSection = styled.div`
  display: flex;
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
  flex-wrap: wrap;
`;

const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.sm};
`;

const ControlLabel = styled.label`
  font-weight: 500;
  color: ${theme.colors.text};
`;

const Select = styled.select`
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
`;

const AnimationDemo: React.FC = () => {
  const [pageTransition, setPageTransition] = useState<'fade' | 'slide' | 'scale' | 'flip' | 'custom'>('fade');
  const [sectionAnimation, setSectionAnimation] = useState<'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'stagger'>('fadeIn');
  const [hoverEffect, setHoverEffect] = useState<'lift' | 'scale' | 'glow' | 'tilt' | 'shimmer' | 'none'>('lift');
  const [loaderType, setLoaderType] = useState<'spinner' | 'dots' | 'pulse' | 'wave' | 'bars'>('spinner');
  const [showLoader, setShowLoader] = useState(false);

  const demoCards = [
    { id: 1, title: '카드 1', content: '첫 번째 데모 카드입니다.' },
    { id: 2, title: '카드 2', content: '두 번째 데모 카드입니다.' },
    { id: 3, title: '카드 3', content: '세 번째 데모 카드입니다.' },
    { id: 4, title: '카드 4', content: '네 번째 데모 카드입니다.' },
    { id: 5, title: '카드 5', content: '다섯 번째 데모 카드입니다.' },
    { id: 6, title: '카드 6', content: '여섯 번째 데모 카드입니다.' }
  ];

  return (
    <PageTransition transitionType={pageTransition} duration={0.5}>
      <DemoContainer>
        <AnimatedSection animation="fadeIn" delay={0.1}>
          <h1>🎬 애니메이션 데모</h1>
          <p>다양한 애니메이션 효과를 테스트해보세요.</p>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.2}>
          <DemoSection>
            <SectionTitle>🎛️ 애니메이션 컨트롤</SectionTitle>
            <ControlsSection>
              <ControlGroup>
                <ControlLabel>페이지 전환:</ControlLabel>
                <Select 
                  value={pageTransition} 
                  onChange={(e) => setPageTransition(e.target.value as any)}
                >
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                  <option value="scale">Scale</option>
                  <option value="flip">Flip</option>
                  <option value="custom">Custom</option>
                </Select>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>섹션 애니메이션:</ControlLabel>
                <Select 
                  value={sectionAnimation} 
                  onChange={(e) => setSectionAnimation(e.target.value as any)}
                >
                  <option value="fadeIn">Fade In</option>
                  <option value="slideUp">Slide Up</option>
                  <option value="slideLeft">Slide Left</option>
                  <option value="slideRight">Slide Right</option>
                  <option value="scale">Scale</option>
                  <option value="stagger">Stagger</option>
                </Select>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>호버 효과:</ControlLabel>
                <Select 
                  value={hoverEffect} 
                  onChange={(e) => setHoverEffect(e.target.value as any)}
                >
                  <option value="lift">Lift</option>
                  <option value="scale">Scale</option>
                  <option value="glow">Glow</option>
                  <option value="tilt">Tilt</option>
                  <option value="shimmer">Shimmer</option>
                  <option value="none">None</option>
                </Select>
              </ControlGroup>

              <ControlGroup>
                <ControlLabel>로더 타입:</ControlLabel>
                <Select 
                  value={loaderType} 
                  onChange={(e) => setLoaderType(e.target.value as any)}
                >
                  <option value="spinner">Spinner</option>
                  <option value="dots">Dots</option>
                  <option value="pulse">Pulse</option>
                  <option value="wave">Wave</option>
                  <option value="bars">Bars</option>
                </Select>
              </ControlGroup>
            </ControlsSection>

            <Button 
              onClick={() => setShowLoader(!showLoader)}
              hoverEffect="glow"
            >
              {showLoader ? '로더 숨기기' : '로더 보기'}
            </Button>
          </DemoSection>
        </AnimatedSection>

        <AnimatedSection animation={sectionAnimation} delay={0.3}>
          <DemoSection>
            <SectionTitle>🎯 호버 효과 데모</SectionTitle>
            <DemoGrid>
              {demoCards.slice(0, 4).map((card, index) => (
                <AnimatedSection 
                  key={card.id} 
                  animation="scale" 
                  delay={0.4 + index * 0.1}
                >
                  <HoverEffect effect={hoverEffect} intensity="medium">
                    <DemoCard>
                      <h3>{card.title}</h3>
                      <p>{card.content}</p>
                    </DemoCard>
                  </HoverEffect>
                </AnimatedSection>
              ))}
            </DemoGrid>
          </DemoSection>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.4}>
          <DemoSection>
            <SectionTitle>📊 스태거 애니메이션 데모</SectionTitle>
            <AnimatedSection animation="stagger" staggerChildren>
              <DemoGrid>
                {demoCards.map((card) => (
                  <DemoCard key={card.id}>
                    <h3>{card.title}</h3>
                    <p>{card.content}</p>
                  </DemoCard>
                ))}
              </DemoGrid>
            </AnimatedSection>
          </DemoSection>
        </AnimatedSection>

        <AnimatedSection animation="fadeIn" delay={0.5}>
          <DemoSection>
            <SectionTitle>⏳ 로더 애니메이션 데모</SectionTitle>
            {showLoader && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '2rem 0' }}>
                <AnimatedLoader 
                  variant={loaderType}
                  size="lg"
                  text="로딩 중..."
                />
              </div>
            )}
          </DemoSection>
        </AnimatedSection>

        <AnimatedSection animation="slideUp" delay={0.6}>
          <DemoSection>
            <SectionTitle>🎨 버튼 호버 효과</SectionTitle>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Button hoverEffect="lift">Lift Effect</Button>
              <Button hoverEffect="scale">Scale Effect</Button>
              <Button hoverEffect="glow">Glow Effect</Button>
              <Button hoverEffect="tilt">Tilt Effect</Button>
              <Button hoverEffect="shimmer">Shimmer Effect</Button>
            </div>
          </DemoSection>
        </AnimatedSection>
      </DemoContainer>
    </PageTransition>
  );
};

export default AnimationDemo;
