import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { theme } from '../../styles/theme';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: TabItem[];
  defaultActiveTab?: string;
  activeTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}


const TabsContainer = styled.div<{ fullWidth?: boolean }>`
  width: ${props => props.fullWidth ? '100%' : 'auto'};
`;

const TabsList = styled.div<{ 
  variant?: string; 
  size?: string; 
  fullWidth?: boolean;
}>`
  display: flex;
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: ${theme.spacing.lg};
  position: relative;
  
  ${props => props.fullWidth && css`
    width: 100%;
  `}

  ${props => {
    switch (props.variant) {
      case 'pills':
        return css`
          background-color: ${theme.colors.background};
          border-radius: ${theme.borderRadius.md};
          padding: ${theme.spacing.xs};
          border-bottom: none;
          gap: ${theme.spacing.xs};
        `;
      case 'underline':
        return css`
          border-bottom: 2px solid ${theme.colors.border};
          gap: 0;
        `;
      default:
        return css`
          gap: 0;
        `;
    }
  }}
`;

const TabButton = styled.button<{ 
  variant?: string; 
  size?: string; 
  isActive?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}>`
  background: none;
  border: none;
  color: ${props => props.isActive ? theme.colors.primary : theme.colors.textSecondary};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return css`
          padding: ${theme.spacing.sm} ${theme.spacing.md};
          font-size: 0.875rem;
        `;
      case 'lg':
        return css`
          padding: ${theme.spacing.lg} ${theme.spacing.xl};
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: ${theme.spacing.md} ${theme.spacing.lg};
          font-size: 1rem;
        `;
    }
  }}

  ${props => {
    switch (props.variant) {
      case 'pills':
        return css`
          border-radius: ${theme.borderRadius.sm};
          background-color: ${props.isActive ? theme.colors.primary : 'transparent'};
          color: ${props.isActive ? 'white' : theme.colors.text};
          
          &:hover:not(:disabled) {
            background-color: ${props.isActive ? theme.colors.primary : theme.colors.background};
            color: ${props.isActive ? 'white' : theme.colors.text};
          }
        `;
      case 'underline':
        return css`
          border-bottom: 2px solid transparent;
          
          &:hover:not(:disabled) {
            color: ${theme.colors.text};
          }
        `;
      default:
        return css`
          border-bottom: 2px solid transparent;
          
          &:hover:not(:disabled) {
            color: ${theme.colors.text};
          }
        `;
    }
  }}

  ${props => props.fullWidth && css`
    flex: 1;
    text-align: center;
  `}
`;

const TabIndicator = styled(motion.div)<{ variant?: string }>`
  position: absolute;
  bottom: 0;
  background-color: ${theme.colors.primary};
  
  ${props => {
    switch (props.variant) {
      case 'pills':
        return css`
          display: none;
        `;
      case 'underline':
        return css`
          height: 2px;
        `;
      default:
        return css`
          height: 2px;
        `;
    }
  }}
`;

const TabPanel = styled.div<{ isActive: boolean }>`
  display: ${props => props.isActive ? 'block' : 'none'};
  color: ${theme.colors.text};
`;

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  activeTab,
  onChange,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  className,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    activeTab || defaultActiveTab || tabs[0]?.id || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const currentActiveTab = activeTab || internalActiveTab;

  useEffect(() => {
    if (tabsListRef.current && tabRefs.current.length > 0) {
      const activeIndex = tabs.findIndex(tab => tab.id === currentActiveTab);
      const activeTabElement = tabRefs.current[activeIndex];
      
      if (activeTabElement) {
        const tabsListRect = tabsListRef.current.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        setIndicatorStyle({
          left: activeTabRect.left - tabsListRect.left,
          width: activeTabRect.width,
        });
      }
    }
  }, [currentActiveTab, tabs]);

  const handleTabClick = (tabId: string) => {
    if (onChange) {
      onChange(tabId);
    } else {
      setInternalActiveTab(tabId);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        const prevIndex = index > 0 ? index - 1 : tabs.length - 1;
        const prevTab = tabs[prevIndex];
        if (!prevTab.disabled) {
          handleTabClick(prevTab.id);
          tabRefs.current[prevIndex]?.focus();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        const nextIndex = index < tabs.length - 1 ? index + 1 : 0;
        const nextTab = tabs[nextIndex];
        if (!nextTab.disabled) {
          handleTabClick(nextTab.id);
          tabRefs.current[nextIndex]?.focus();
        }
        break;
      case 'Home':
        event.preventDefault();
        const firstTab = tabs[0];
        if (!firstTab.disabled) {
          handleTabClick(firstTab.id);
          tabRefs.current[0]?.focus();
        }
        break;
      case 'End':
        event.preventDefault();
        const lastTab = tabs[tabs.length - 1];
        if (!lastTab.disabled) {
          handleTabClick(lastTab.id);
          tabRefs.current[tabs.length - 1]?.focus();
        }
        break;
    }
  };

  return (
    <TabsContainer fullWidth={fullWidth} className={className}>
      <TabsList
        ref={tabsListRef}
        variant={variant}
        size={size}
        fullWidth={fullWidth}
        role="tablist"
      >
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            variant={variant}
            size={size}
            isActive={tab.id === currentActiveTab}
            disabled={tab.disabled}
            fullWidth={fullWidth}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            role="tab"
            aria-selected={tab.id === currentActiveTab}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={tab.id === currentActiveTab ? 0 : -1}
          >
            {tab.label}
          </TabButton>
        ))}
        {variant !== 'pills' && (
          <TabIndicator
            variant={variant}
            style={indicatorStyle}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabPanel
          key={tab.id}
          isActive={tab.id === currentActiveTab}
          role="tabpanel"
          id={`tabpanel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          tabIndex={0}
        >
          {tab.content}
        </TabPanel>
      ))}
    </TabsContainer>
  );
};

export default Tabs;
