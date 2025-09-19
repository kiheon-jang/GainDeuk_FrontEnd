import React, { useState } from 'react';
import styled from 'styled-components';
import { theme, mediaQueries } from '../../styles/theme';
import { useHighContrast } from '../../hooks/useAccessibility';
import Button from './Button';
import Toggle from './Toggle';
import ScreenReaderOnly from './ScreenReaderOnly';

const PanelContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  right: ${props => props.isOpen ? '0' : '-300px'};
  transform: translateY(-50%);
  width: 300px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md} 0 0 ${theme.borderRadius.md};
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  
  ${mediaQueries.mobile} {
    width: 280px;
    right: ${props => props.isOpen ? '0' : '-280px'};
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
`;

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  padding: ${theme.spacing.xs};
  border-radius: ${theme.borderRadius.sm};
  
  &:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

const PanelContent = styled.div`
  padding: ${theme.spacing.lg};
`;

const OptionGroup = styled.div`
  margin-bottom: ${theme.spacing.lg};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const OptionLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm};
  font-weight: 500;
  color: ${theme.colors.text};
  cursor: pointer;
`;

const OptionDescription = styled.p`
  margin: 0 0 ${theme.spacing.sm} 0;
  font-size: 0.875rem;
  color: ${theme.colors.textSecondary};
  line-height: 1.4;
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: fixed;
  top: 50%;
  right: ${props => props.isOpen ? '300px' : '0'};
  transform: translateY(-50%);
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border: none;
  padding: ${theme.spacing.md} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.md} 0 0 ${theme.borderRadius.md};
  cursor: pointer;
  z-index: 1001;
  transition: right 0.3s ease;
  font-size: 1.5rem;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.white};
    outline-offset: 2px;
  }
  
  ${mediaQueries.mobile} {
    right: ${props => props.isOpen ? '280px' : '0'};
  }
`;

const FontSizeContainer = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const FontSizeButton = styled.button<{ isActive?: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.sm};
  background-color: ${props => props.isActive ? theme.colors.primary : theme.colors.background};
  color: ${props => props.isActive ? theme.colors.white : theme.colors.text};
  cursor: pointer;
  font-size: 0.875rem;
  
  &:hover {
    background-color: ${props => props.isActive ? theme.colors.primaryDark : theme.colors.surface};
  }
  
  &:focus {
    outline: 2px solid ${theme.colors.primary};
    outline-offset: 2px;
  }
`;

interface AccessibilityPanelProps {
  className?: string;
}

const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large'>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const { isHighContrast, toggleHighContrast } = useHighContrast();

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  const handleFontSizeChange = (size: 'small' | 'normal' | 'large') => {
    setFontSize(size);
    const root = document.documentElement;
    
    switch (size) {
      case 'small':
        root.style.fontSize = '14px';
        break;
      case 'large':
        root.style.fontSize = '18px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }
  };

  const handleReducedMotionToggle = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    
    if (newValue) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  };

  return (
    <>
      <ToggleButton
        isOpen={isOpen}
        onClick={togglePanel}
        aria-label={isOpen ? '접근성 패널 닫기' : '접근성 패널 열기'}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        ♿
      </ToggleButton>
      
      <PanelContainer
        id="accessibility-panel"
        isOpen={isOpen}
        className={className}
        role="dialog"
        aria-labelledby="accessibility-panel-title"
        aria-hidden={!isOpen}
      >
        <PanelHeader>
          <PanelTitle id="accessibility-panel-title">
            접근성 설정
          </PanelTitle>
          <CloseButton
            onClick={togglePanel}
            aria-label="패널 닫기"
          >
            ×
          </CloseButton>
        </PanelHeader>
        
        <PanelContent>
          <OptionGroup>
            <OptionLabel htmlFor="high-contrast-toggle">
              고대비 모드
              <Toggle
                id="high-contrast-toggle"
                checked={isHighContrast}
                onChange={toggleHighContrast}
                aria-describedby="high-contrast-desc"
              />
            </OptionLabel>
            <OptionDescription id="high-contrast-desc">
              텍스트와 배경 간의 대비를 높여 가독성을 향상시킵니다.
            </OptionDescription>
          </OptionGroup>
          
          <OptionGroup>
            <OptionLabel htmlFor="reduced-motion-toggle">
              애니메이션 줄이기
              <Toggle
                id="reduced-motion-toggle"
                checked={reducedMotion}
                onChange={handleReducedMotionToggle}
                aria-describedby="reduced-motion-desc"
              />
            </OptionLabel>
            <OptionDescription id="reduced-motion-desc">
              페이지의 애니메이션과 전환 효과를 줄입니다.
            </OptionDescription>
          </OptionGroup>
          
          <OptionGroup>
            <div role="group" aria-labelledby="font-size-label">
              <div id="font-size-label" style={{ marginBottom: theme.spacing.sm, fontWeight: 500 }}>
                글꼴 크기
              </div>
              <OptionDescription>
                읽기 편한 글꼴 크기를 선택하세요.
              </OptionDescription>
              <FontSizeContainer>
                <FontSizeButton
                  isActive={fontSize === 'small'}
                  onClick={() => handleFontSizeChange('small')}
                  aria-pressed={fontSize === 'small'}
                >
                  작게
                </FontSizeButton>
                <FontSizeButton
                  isActive={fontSize === 'normal'}
                  onClick={() => handleFontSizeChange('normal')}
                  aria-pressed={fontSize === 'normal'}
                >
                  보통
                </FontSizeButton>
                <FontSizeButton
                  isActive={fontSize === 'large'}
                  onClick={() => handleFontSizeChange('large')}
                  aria-pressed={fontSize === 'large'}
                >
                  크게
                </FontSizeButton>
              </FontSizeContainer>
            </div>
          </OptionGroup>
          
          <OptionGroup>
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                // Reset all accessibility settings
                setFontSize('normal');
                setReducedMotion(false);
                if (isHighContrast) toggleHighContrast();
                document.documentElement.style.fontSize = '16px';
                document.documentElement.classList.remove('reduce-motion');
              }}
            >
              설정 초기화
            </Button>
          </OptionGroup>
        </PanelContent>
        
        <ScreenReaderOnly>
          <div aria-live="polite" aria-atomic="true" id="accessibility-announcements" />
        </ScreenReaderOnly>
      </PanelContainer>
    </>
  );
};

export default AccessibilityPanel;
