import { useState } from "react";
import { Box, Button, Container, TextField, Typography, CircularProgress } from "@mui/material";
import APIService from "../services/APIService";

function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await APIService.request("/login", "POST", { username, password });
      localStorage.setItem("access_token", response.access_token);
      APIService.setToken(response.access_token);
      // Redirect or perform any other necessary actions after login
    } catch (error: any) {
      if (error.message.includes("Please update your client application")) {
        setMessage(error.message);
      } else {
        setMessage("Invalid credentials");
        console.error("Error during login:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} sx={{ mt: 3 }}>
          <TextField label="Username" value={username} onChange={(e) => setUsername(e.target.value)} margin="normal" fullWidth />
          <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} margin="normal" fullWidth />
          <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth sx={{ mt: 2 }}>
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
        {message && (
          <Typography variant="body1" color="error" sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    </Container>
  );
}

export default Login;
