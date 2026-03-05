import React, { createContext, useContext, useState, ReactNode } from 'react';
import { InvitationModal } from './InvitationModal';

interface InvitationContextType {
  openInvitation: (destinationUrl: string) => void;
  closeInvitation: () => void;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export function useInvitation() {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error('useInvitation must be used within an InvitationProvider');
  }
  return context;
}

interface InvitationProviderProps {
  children: ReactNode;
}

export function InvitationProvider({ children }: InvitationProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [destinationUrl, setDestinationUrl] = useState('');

  const openInvitation = (url: string) => {
    setDestinationUrl(url);
    setIsOpen(true);
  };

  const closeInvitation = () => {
    setIsOpen(false);
    setDestinationUrl('');
  };

  return (
    <InvitationContext.Provider value={{ openInvitation, closeInvitation }}>
      {children}
      <InvitationModal 
        isOpen={isOpen} 
        onClose={closeInvitation} 
        destinationUrl={destinationUrl} 
      />
    </InvitationContext.Provider>
  );
}
