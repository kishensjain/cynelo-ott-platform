const API_URL = process.env.VITE_API_URL;

export const startKeepAlive = () => {
  const ping = async () => {
    try {
      await fetch(`${API_URL}/health`, {
        method: "GET",
      });

      console.log("Backend keep-alive ping");
    } catch (error) {
      console.log("Keep-alive ping failed");
    }
  };

  ping();

  // print every 14 minutes
  const interval = setInterval(ping, 14 * 60 * 1000);

  return () => clearInterval(interval);
};
