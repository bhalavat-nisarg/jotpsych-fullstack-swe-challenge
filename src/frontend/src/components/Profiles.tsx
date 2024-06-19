import { useState, useEffect } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Avatar,
    Container,
    CircularProgress,
} from "@mui/material";

function Profile() {
    const [userData, setUserData] = useState<{
        username: string;
        name: string;
        bio: string;
        profile_pic_url: string;
    } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("access_token");

            if (token) {
                try {
                    const response = await axios.get("http://localhost:3002/user", {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setUserData(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                >
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (!userData) {
        return (
            <Container maxWidth="sm">
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="100vh"
                >
                    <Typography variant="h5">User not found</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight="100vh"
            >
                <Avatar
                    src={userData.profile_pic_url}
                    alt={userData.name}
                    sx={{ width: 128, height: 128, mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                    {userData.name}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    @{userData.username}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    {userData.bio}
                </Typography>
            </Box>
        </Container>
    );
}

export default Profile;