import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AlertModal, ConfirmModal } from '../components/Modal';

type AlertType = 'info' | 'success' | 'warning' | 'danger';

interface ModalContextProps {
  showAlert: (title: string, message: string, type?: AlertType) => void;
  showConfirm: (
    title: string, 
    message: string, 
    onConfirm: () => void, 
    type?: AlertType,
    confirmText?: string,
    cancelText?: string
  ) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  // Alert state
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<AlertType>('info');
  
  // Confirm state
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmHandler, setConfirmHandler] = useState<() => void>(() => {});
  const [confirmType, setConfirmType] = useState<AlertType>('info');
  const [confirmButtonText, setConfirmButtonText] = useState('OK');
  const [cancelButtonText, setCancelButtonText] = useState('Cancel');
  
  const showAlert = useCallback((title: string, message: string, type: AlertType = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertModalOpen(true);
  }, []);
  
  const showConfirm = useCallback((
    title: string, 
    message: string, 
    onConfirm: () => void, 
    type: AlertType = 'info',
    confirmText = 'OK',
    cancelText = 'Cancel'
  ) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmHandler(() => onConfirm);
    setConfirmType(type);
    setConfirmButtonText(confirmText);
    setCancelButtonText(cancelText);
    setConfirmModalOpen(true);
  }, []);
  
  const handleConfirm = useCallback(() => {
    setConfirmModalOpen(false);
    confirmHandler();
  }, [confirmHandler]);
  
  return (
    <ModalContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      
      <AlertModal
        isOpen={alertModalOpen}
        onClose={() => setAlertModalOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type={alertType}
      />
      
      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
        type={confirmType}
        confirmText={confirmButtonText}
        cancelText={cancelButtonText}
      />
    </ModalContext.Provider>
  );
};

export const useModalContext = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export default ModalContext; 