import { useState, useEffect, useCallback, useRef } from 'react';

const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const watchIdRef = useRef(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    // First try with high accuracy
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
      },
      (err) => {
        // If high accuracy fails, try with low accuracy
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setLocation({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            });
            setLoading(false);
          },
          (err2) => {
            setError(err2.message);
            setLoading(false);
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0, // Always get fresh location — no cache!
      }
    );
  }, []);

  // Auto start watching location on mount
  useEffect(() => {
    if (!navigator.geolocation) return;

    setLoading(true);

    // Start watching location continuously
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        // Fallback — try once without high accuracy
        getLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );

    // Cleanup on unmount
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const watchLocation = useCallback((callback) => {
    if (!navigator.geolocation) return null;
    return navigator.geolocation.watchPosition(
      (pos) => {
        const loc = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setLocation(loc);
        if (callback) callback(loc);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 0 }
    );
  }, []);

  return { location, error, loading, getLocation, watchLocation };
};

export default useGeolocation;