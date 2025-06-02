import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '../components/checkout/CheckoutModal';

// Define the order details interface
interface OrderDetails {
  gameType: 'lol' | 'valorant' | 'wild-rift';
  boostType: 'solo' | 'duo';
  service?: string;
  price: number;
  discount?: number;
  estimatedTime?: string;
  selectedOptions?: Array<{name: string, price: string}>;
  currentRank?: any;
  desiredRank?: any;
  server?: string;
  options?: any;
}

// Define the context interface
interface CheckoutContextType {
  isCheckoutModalOpen: boolean;
  currentOrder: OrderDetails | null;
  orderComplete: boolean;
  orderId: string | null;
  initiateCheckout: (orderDetails: OrderDetails) => void;
  closeCheckoutModal: () => void;
  handleCheckoutComplete: (orderId: string) => void;
}

// Create a default context value
const defaultContextValue: CheckoutContextType = {
  isCheckoutModalOpen: false,
  currentOrder: null,
  orderComplete: false,
  orderId: null,
  initiateCheckout: () => {},
  closeCheckoutModal: () => {},
  handleCheckoutComplete: () => {}
};

// Create the context with default value
const CheckoutContext = createContext<CheckoutContextType>(defaultContextValue);

interface CheckoutProviderProps {
  children: ReactNode;
}

/**
 * Provider component that makes checkout functionality available to all children
 */
export const CheckoutProvider: React.FC<CheckoutProviderProps> = ({ children }) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetails | null>(null);
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  // Use navigate inside a try/catch to avoid errors in SSR or testing
  let navigate = useCallback((path: string) => {
    console.log(`Navigation to ${path} would happen here`);
  }, []);
  
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch (error) {
    console.error("Error using useNavigate:", error);
  }
  
  /**
   * Initiates the checkout process with order details
   */
  const initiateCheckout = useCallback((orderDetails: OrderDetails) => {
    setCurrentOrder(orderDetails);
    setIsCheckoutModalOpen(true);
    setOrderComplete(false);
    setOrderId(null);
  }, []);
  
  /**
   * Handles closing of the checkout modal
   */
  const closeCheckoutModal = useCallback(() => {
    setIsCheckoutModalOpen(false);
    
    // Clear the order details after a delay to allow for smooth transitions
    setTimeout(() => {
      if (!orderComplete) {
        setCurrentOrder(null);
      }
    }, 300);
  }, [orderComplete]);
  
  /**
   * Handles the completion of the checkout process
   */
  const handleCheckoutComplete = useCallback((completedOrderId: string) => {
    setOrderId(completedOrderId);
    setOrderComplete(true);
    
    // Close the modal after a delay to show the success message
    setTimeout(() => {
      setIsCheckoutModalOpen(false);
      
      // Navigate to the user dashboard if needed
      navigate('/dashboard');
      
      // Reset the state after navigation
      setTimeout(() => {
        setCurrentOrder(null);
        setOrderComplete(false);
      }, 300);
    }, 2000);
  }, [navigate]);
  
  const contextValue = {
    isCheckoutModalOpen,
    currentOrder,
    orderComplete,
    orderId,
    initiateCheckout,
    closeCheckoutModal,
    handleCheckoutComplete
  };
  
  return (
    <CheckoutContext.Provider value={contextValue}>
      {children}
      {/* Render the modal here so it's available throughout the app */}
      {currentOrder && isCheckoutModalOpen && (
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={closeCheckoutModal}
          orderDetails={currentOrder}
          onComplete={handleCheckoutComplete}
        />
      )}
    </CheckoutContext.Provider>
  );
};

/**
 * Custom hook to access the checkout context
 */
export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckoutContext must be used within a CheckoutProvider');
  }
  return context;
};

export default CheckoutContext; 