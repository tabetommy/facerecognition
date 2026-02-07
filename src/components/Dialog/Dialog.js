import React, { useState } from 'react';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, TextField, Box, Typography, Divider 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

export default function AuthDialog({open, setOpen, setUser, dataReset, user}) {
  const [isLogin, setIsLogin] = useState(true); // Schalter für Login/Registrierung
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClickOpenClose = () => {
    if(!Object.keys(user).length){
      setOpen(true);
     }else{
      dataReset()
      
     }
  };
  
  const handleClose = () => {
    setOpen(false);
    setError('');
    setIsLogin(true); // Zurücksetzen auf Login beim Schließen
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/signin' : '/register';
    const payload = { username, password };

    try {
      const response = await fetch(`https://facerecognitionapp-api-zzin.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data || 'Etwas ist schiefgelaufen');
      }
      localStorage.setItem('token',data.token);
      setUser(data.user)
      handleClose();
      setUsername('');
       setPassword('');

      // Hier Token speichern (z.B. localStorage.setItem('token', data.token))
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemo = async() => {
   
    const randomNumber = Math.floor(Math.random() * 900) + 100;
    const username=`Demo_Nuzter_${randomNumber}`;
    const password=`Demo!pass${randomNumber}`;
    // setUsername(name);
    // setPassword(`Demo!pass${randomNumber}`);
     const payload = { username, password };
    try {
      const response = await fetch(`https://facerecognitionapp-api-zzin.onrender.com/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data || 'Etwas ist schiefgelaufen');
      }
      localStorage.setItem('token',data.token);
      setUser(data.user)
      handleClose();
      setUsername('');
       setPassword('');
      // Hier Token speichern (z.B. localStorage.setItem('token', data.token))
    } catch (err) {
      setError(err.message);
    }
  };



  return (
    <React.Fragment>
      <Dialog open={open} onClose={()=>{}} maxWidth="xs" fullWidth disableEscapeKeyDown>
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          {isLogin ? 'Anmeldung' : 'Konto erstellen'}
        </DialogTitle>
        
        <DialogContent>
          <DialogContentText sx={{ mb: 2, textAlign: 'center' }}>
            {isLogin 
              ? 'Willkommen zurück! Bitte gib deine Daten ein.' 
              : 'Werde Teil unserer Community und tracke deine Bilder.'}
          </DialogContentText>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Benutzername"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Passwort"
              // Dynamischer Typ: 'text' zeigt das Passwort, 'password' verbirgt es
              type={showPassword ? 'text' : 'password'} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="Passwort-Sichtbarkeit umschalten"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={!isLogin && "Mind. 8 Zeichen, ein Großbuchstabe & Sonderzeichen"}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ flexDirection: 'column', px: 3, pb: 3, gap: 1 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ py: 1.5 }}
          >
            {isLogin ? 'Einloggen' : 'Registrieren'}
          </Button>

          <Button variant="text" size="small" onClick={toggleMode}>
            {isLogin ? 'Noch kein Konto? Hier registrieren' : 'Bereits ein Konto? Hier einloggen'}
          </Button>

          <Divider sx={{ width: '100%', my: 1 }}>ODER</Divider>

          <Button 
            fullWidth 
            variant="outlined" 
            color="secondary" 
            onClick={handleDemo}
          >
            Demo-Account nutzen
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}