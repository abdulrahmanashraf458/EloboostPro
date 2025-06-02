import { useState, useCallback } from 'react';

interface UseModalReturnType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModal = (initialState = false): UseModalReturnType => {
  const [isOpen, setIsOpen] = useState(initialState);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const toggleModal = useCallback(() => setIsOpen(prev => !prev), []);

  return { isOpen, openModal, closeModal, toggleModal };
};

interface UseConfirmModalReturnType<T> {
  isOpen: boolean;
  data: T | null;
  openModal: (data?: T) => void;
  closeModal: () => void;
  modalData: T | null;
}

export const useConfirmModal = <T = any>(initialState = false): UseConfirmModalReturnType<T> => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState<T | null>(null);

  const openModal = useCallback((data: T | null = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return { 
    isOpen, 
    data: modalData, 
    openModal, 
    closeModal, 
    modalData
  };
};

export default useModal; 