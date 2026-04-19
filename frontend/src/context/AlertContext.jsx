import { createContext, useContext, useState, useEffect } from 'react';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';

const AlertContext = createContext(null);

export const AlertProvider = ({ children }) => {
  const { user } = useAuth();
  const [activeAlert, setActiveAlert] = useState(null);
  const [incomingAlert, setIncomingAlert] = useState(null);
  const [responderInfo, setResponderInfo] = useState(null);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !user) return;

    // For users: responder assigned
    socket.on('responderAssigned', (data) => {
      setResponderInfo(data);
    });

    // For users: alert resolved
    socket.on('alertResolved', () => {
      setActiveAlert(null);
      setResponderInfo(null);
    });

    // For volunteers: new alert nearby
    socket.on('newAlert', (data) => {
      if (user.role === 'volunteer') {
        setIncomingAlert(data);
      }
    });

    return () => {
      socket.off('responderAssigned');
      socket.off('alertResolved');
      socket.off('newAlert');
    };
  }, [user]);

  return (
    <AlertContext.Provider value={{
      activeAlert, setActiveAlert,
      incomingAlert, setIncomingAlert,
      responderInfo, setResponderInfo,
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlertContext = () => useContext(AlertContext);
