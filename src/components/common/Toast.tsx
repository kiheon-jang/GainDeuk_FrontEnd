import React from 'react';
import toast, { Toaster, ToastOptions } from 'react-hot-toast';
import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
}

interface ToastContainerProps {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  className?: string;
}

const StyledToaster = styled(Toaster)<{ position?: string }>`
  .go3958317564 {
    background-color: ${theme.colors.surface};
    color: ${theme.colors.text};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    box-shadow: ${theme.shadows.lg};
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 500;
    padding: ${theme.spacing.md} ${theme.spacing.lg};
    max-width: 400px;
    word-wrap: break-word;
    z-index: 9999;
  }

  .go3958317564[data-type="success"] {
    border-left: 4px solid ${theme.colors.success};
  }

  .go3958317564[data-type="error"] {
    border-left: 4px solid ${theme.colors.error};
  }

  .go3958317564[data-type="warning"] {
    border-left: 4px solid ${theme.colors.warning};
  }

  .go3958317564[data-type="info"] {
    border-left: 4px solid ${theme.colors.info};
  }

  .go3958317564 .go3958317565 {
    color: ${theme.colors.textSecondary};
    font-size: 1.2em;
    margin-right: ${theme.spacing.sm};
  }

  .go3958317564 .go3958317566 {
    color: ${theme.colors.textSecondary};
    background: none;
    border: none;
    font-size: 1.2em;
    cursor: pointer;
    padding: ${theme.spacing.xs};
    border-radius: ${theme.borderRadius.sm};
    transition: all 0.2s ease;
    margin-left: ${theme.spacing.sm};
  }

  .go3958317564 .go3958317566:hover {
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
  }
`;

const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return '✅';
    case 'error':
      return '❌';
    case 'warning':
      return '⚠️';
    case 'info':
      return 'ℹ️';
    default:
      return '💬';
  }
};

const getToastOptions = (type: string, duration?: number): ToastOptions => {
  return {
    duration: duration || 4000,
    position: 'top-right',
    style: {
      background: theme.colors.surface,
      color: theme.colors.text,
      border: `1px solid ${theme.colors.border}`,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.lg,
    },
    icon: getToastIcon(type),
    iconTheme: {
      primary: theme.colors.text,
      secondary: theme.colors.surface,
    },
  };
};

// Toast notification functions
export const showToast = {
  success: (message: string, duration?: number) => {
    return toast.success(message, getToastOptions('success', duration));
  },
  
  error: (message: string, duration?: number) => {
    return toast.error(message, getToastOptions('error', duration));
  },
  
  warning: (message: string, duration?: number) => {
    return toast(message, {
      ...getToastOptions('warning', duration),
      icon: getToastIcon('warning'),
    });
  },
  
  info: (message: string, duration?: number) => {
    return toast(message, {
      ...getToastOptions('info', duration),
      icon: getToastIcon('info'),
    });
  },
  
  loading: (message: string) => {
    return toast.loading(message, {
      style: {
        background: theme.colors.surface,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.lg,
      },
    });
  },
  
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    }
  ) => {
    return toast.promise(promise, messages, {
      style: {
        background: theme.colors.surface,
        color: theme.colors.text,
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.lg,
      },
      success: {
        icon: getToastIcon('success'),
      },
      error: {
        icon: getToastIcon('error'),
      },
      loading: {
        icon: '⏳',
      },
    });
  },
  
  dismiss: (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  },
};

// Toast Container Component
const ToastContainer: React.FC<ToastContainerProps> = ({
  position = 'top-right',
  className,
}) => {
  const getPosition = () => {
    switch (position) {
      case 'top-left':
        return 'top-left';
      case 'top-center':
        return 'top-center';
      case 'top-right':
        return 'top-right';
      case 'bottom-left':
        return 'bottom-left';
      case 'bottom-center':
        return 'bottom-center';
      case 'bottom-right':
        return 'bottom-right';
      default:
        return 'top-right';
    }
  };

  return (
    <StyledToaster
      position={getPosition()}
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.colors.surface,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          boxShadow: theme.shadows.lg,
        },
      }}
      className={className}
    />
  );
};

// Individual Toast Component (for programmatic use)
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 4000,
  position = 'top-right',
}) => {
  const showToastMessage = () => {
    switch (type) {
      case 'success':
        showToast.success(message, duration);
        break;
      case 'error':
        showToast.error(message, duration);
        break;
      case 'warning':
        showToast.warning(message, duration);
        break;
      case 'info':
      default:
        showToast.info(message, duration);
        break;
    }
  };

  // This component is mainly for programmatic use
  React.useEffect(() => {
    showToastMessage();
  }, [message, type, duration]);

  return null;
};

export { Toast, ToastContainer };
export default Toast;
