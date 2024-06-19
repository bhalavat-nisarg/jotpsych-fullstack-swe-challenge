import { useState, useEffect } from "react";
import { Box, Typography, Container, CircularProgress, Avatar, Button } from "@mui/material";
import APIService from "../services/APIService";

function Home() {
  const [username, setUsername] = useState<string>("");
  const [motto, setMotto] = useState<string>("");  // Added motto state
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await APIService.request("/user", "GET", null, true);
        setUsername(response.username);
        setMotto(response.motto);  // Set the retrieved motto
      } catch (error: any) {
        if (error.message.includes("Please update your client application")) {
          setMessage(error.message);
        } else {
          console.error("Error fetching user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await APIService.request("/logout", "POST", null, true);
      localStorage.removeItem("access_token");
      // Redirect or perform any other necessary actions after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 4, textAlign: "center" }}>
            <Avatar sx={{ width: 64, height: 64, backgroundColor: "primary.main", mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              Welcome, {username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Motto: {motto}
            </Typography>
            <Button onClick={handleLogout} variant="contained" color="primary">
              Logout
            </Button>
            {message && (
              <Typography variant="body1" color="error" sx={{ mt: 2 }}>
                {message}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;
