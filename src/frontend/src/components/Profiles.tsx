import { useState, useEffect } from "react";
import { Box, Typography, Container, CircularProgress, Avatar } from "@mui/material";
import APIService from "../services/APIService";

function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await APIService.request("/profiles", "GET", null, true);
        setProfiles(response);
      } catch (error: any) {
        if (error.message.includes("Please update your client application")) {
          setMessage(error.message);
        } else {
          console.error("Error fetching profiles:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <Container maxWidth="md">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        {loading ? (
          <CircularProgress />
        ) : (
          <Box sx={{ width: "100%" }}>
            {profiles.map((profile, index) => (
              <Box key={index} sx={{ bgcolor: "background.paper", boxShadow: 3, borderRadius: 2, p: 4, mb: 2 }}>
                <Avatar src={profile.profilePicUrl} sx={{ width: 64, height: 64, backgroundColor: "primary.main", mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  {profile.name}
                </Typography>
                <Typography variant="body1">{profile.bio}</Typography>
              </Box>
            ))}
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

export default Profiles;
