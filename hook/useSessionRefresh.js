// hooks/useSessionRefresh.js
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export function useSessionRefresh() {
  const { data: session, update } = useSession();

  useEffect(() => {
    // Refresh session when page becomes visible (user switches back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session) {
        update();
      }
    };

    // Refresh session when window gains focus
    const handleFocus = () => {
      if (session) {
        update();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [session, update]);
}