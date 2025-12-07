import { useEffect } from "react";
import { tokenManager, userManager } from "../services/apiClient";
import authApi from "../services/authApi";

const useAuthTokens = () => {
  useEffect(() => {
    const handleAuthTokens = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");
        console.log("Access Token from URL:", accessToken);
        console.log("Refresh Token from URL:", refreshToken);
        if (accessToken && refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
          localStorage.setItem("access_token", accessToken);
          tokenManager.token = accessToken;
          const response = await authApi.getProfile();
          userManager.user = response.data;

          const newUrl = window.location.pathname;
          window.history.replaceState({}, document.title, newUrl);
        }
      } catch (error) {
        console.error("Error handling auth tokens:", error);
      }
    };

    handleAuthTokens();
  }, []);
};

export default useAuthTokens;
