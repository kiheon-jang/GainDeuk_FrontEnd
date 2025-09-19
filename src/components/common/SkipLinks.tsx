import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

const SkipLinksContainer = styled.div`
  position: absolute;
  top: -100px;
  left: 0;
  right: 0;
  z-index: 9999;
  
  &:focus-within {
    top: 0;
  }
`;

const SkipLink = styled.a`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  padding: ${theme.spacing.sm} ${theme.spacing.md};
  border-radius: 0 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  
  &:focus {
    outline: 2px solid ${theme.colors.white};
    outline-offset: 2px;
  }
  
  &:hover {
    background-color: ${theme.colors.primaryDark};
  }
`;

interface SkipLinksProps {
  links: Array<{
    target: string;
    label: string;
  }>;
}

const SkipLinks: React.FC<SkipLinksProps> = ({ links }) => {
  const handleSkipToContent = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(target);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <SkipLinksContainer>
      {links.map((link, index) => (
        <SkipLink
          key={link.target}
          href={`#${link.target}`}
          onClick={handleSkipToContent(link.target)}
          style={{ top: `${index * 50}px` }}
        >
          {link.label}
        </SkipLink>
      ))}
    </SkipLinksContainer>
  );
};

export default SkipLinks;
