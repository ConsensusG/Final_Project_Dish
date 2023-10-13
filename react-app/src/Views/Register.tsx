import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState, FormEvent } from 'react';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Firebase"
import { useNavigate } from 'react-router-dom';



const defaultTheme = createTheme();

export default function SignUp() {
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(email, password);
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                setUserId(user.uid);
                console.log(user)
                setShowSuccessMessage(true);
                // ...

                setTimeout(() => {
                    setShowSuccessMessage(false); // Clear the state
                    navigate('/sign-in'); // Navigate to the sign-in page
                }, 2000);

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage)
                // ..
            });
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Register
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            onChange={(event) => setEmail(event.target.value)}
                            sx={{ backgroundColor: 'white', mt: 1, mb: 1, borderRadius: '4px' }}
                        />
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            onChange={(event) => setPassword(event.target.value)}
                            sx={{ backgroundColor: 'white', mt: 1, mb: 1, borderRadius: '4px' }}
                        />
                        <Box component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                            {showSuccessMessage && (
                                <Box component="div" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                                    <span role="img" aria-label="smiley">😊</span>
                                    <span>Successfully registered!</span>
                                    <span role="img" aria-label="smiley">😊</span>
                                </Box>
                            )}

                        </Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Register
                        </Button>
                    </Box>
                </Box>

            </Container>
        </ThemeProvider>
    );
}
