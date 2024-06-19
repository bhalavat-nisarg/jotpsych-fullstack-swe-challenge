import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Avatar,
  Button,
} from "@mui/material";

function Home() {
  const [username, setUsername] = useState<string>("");
  const [motto, setMotto] = useState<string>("My motto goes here!");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access_token");

      if (token) {
        try {
          const response = await axios.get("http://localhost:3002/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUsername(response.data.username);
        } catch (error) {
          console.error("Error fetching user:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("access_token");
      // Redirect or perform any other necessary actions after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box
            sx={{
              bgcolor: "background.paper",
              boxShadow: 3,
              borderRadius: 2,
              p: 4,
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                width: 64,
                height: 64,
                backgroundColor: "primary.main",
                mb: 2,
              }}
            />
            <Typography variant="h6" gutterBottom>
              {username}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {motto}
            </Typography>
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mr: 2 }}
                onClick={() => setMotto("New Motto!")}
              >
                Record (New) Motto
              </Button>
              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default Home;