import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { theme, mediaQueries } from '../../styles/theme';
import ConnectionStatus from './ConnectionStatus';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${theme.colors.border};
  transition: all 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.md} ${theme.spacing.lg};
  max-width: 1200px;
  margin: 0 auto;

  ${mediaQueries.mobile} {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  font-size: 1.5rem;
  font-weight: 700;
  color: ${theme.colors.primary};
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.text};
  }

  ${mediaQueries.mobile} {
    font-size: 1.25rem;
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  border-radius: ${theme.borderRadius.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  font-size: 1.2rem;

  ${mediaQueries.mobile} {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.lg};

  ${mediaQueries.mobile} {
    display: none;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? theme.colors.text : theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    color: ${theme.colors.text};
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${props => props.$isActive && `
    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background-color: ${theme.colors.primary};
      border-radius: 1px;
    }
  `}
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.md};

  ${mediaQueries.mobile} {
    gap: ${theme.spacing.sm};
  }
`;

const NotificationButton = styled.button`
  position: relative;
  background: none;
  border: none;
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.text};
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  background-color: ${theme.colors.primary};
  border-radius: 50%;
  border: 2px solid ${theme.colors.background};
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${theme.spacing.sm};
  background: none;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${mediaQueries.mobile} {
    gap: ${theme.spacing.xs};
  }
`;

const ProfileAvatar = styled.div`
  width: 32px;
  height: 32px;
  background: linear-gradient(45deg, ${theme.colors.primary}, #FF6B6B);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
  font-size: 0.9rem;

  ${mediaQueries.mobile} {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${theme.colors.text};
  cursor: pointer;
  padding: ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.sm};
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${mediaQueries.mobile} {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: ${theme.spacing.md};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  transition: transform 0.3s ease;

  ${mediaQueries.mobile} {
    display: block;
  }
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  color: ${props => props.$isActive ? theme.colors.text : theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  padding: ${theme.spacing.md} 0;
  border-bottom: 1px solid ${theme.colors.border};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.text};
  }

  &:last-child {
    border-bottom: none;
  }
`;

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
  };
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ user, notificationCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { path: '/', label: '대시보드' },
    { path: '/signals', label: '신호 분석' },
    { path: '/coins', label: '코인 분석' },
    { path: '/strategy', label: '투자 전략' },
    { path: '/alerts', label: '알림 센터' },
    { path: '/analytics', label: '분석 도구' },
    { path: '/components', label: '컴포넌트' },
    { path: '/profile', label: '프로필' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <HeaderContainer role="banner">
      <HeaderContent>
        <Logo to="/" aria-label="GainDeuk 홈으로 이동">
          <LogoIcon aria-hidden="true">G</LogoIcon>
          GainDeuk
        </Logo>

        <Navigation role="navigation" aria-label="주 메뉴">
          {navigationItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              $isActive={location.pathname === item.path}
              aria-current={location.pathname === item.path ? 'page' : undefined}
            >
              {item.label}
            </NavLink>
          ))}
        </Navigation>

        <UserSection>
          <ConnectionStatus showText={false} />
          
          <NotificationButton
            aria-label={`알림 ${notificationCount > 0 ? `(${notificationCount}개의 새 알림)` : ''}`}
            role="button"
            tabIndex={0}
          >
            <span aria-hidden="true">🔔</span>
            {notificationCount > 0 && (
              <NotificationBadge aria-label={`${notificationCount}개의 새 알림`} />
            )}
          </NotificationButton>

          <ProfileButton
            aria-label={`사용자 프로필 메뉴 (${user?.name || '사용자'})`}
            role="button"
            tabIndex={0}
          >
            <ProfileAvatar aria-hidden="true">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </ProfileAvatar>
            <span style={{ display: 'block' }}>
              {user?.name || '사용자'}
            </span>
          </ProfileButton>

          <MobileMenuButton
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span aria-hidden="true">☰</span>
          </MobileMenuButton>
        </UserSection>
      </HeaderContent>

      <MobileMenu
        id="mobile-menu"
        $isOpen={isMobileMenuOpen}
        role="navigation"
        aria-label="모바일 메뉴"
        aria-hidden={!isMobileMenuOpen}
      >
        {navigationItems.map((item) => (
          <MobileNavLink
            key={item.path}
            to={item.path}
            $isActive={location.pathname === item.path}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;
