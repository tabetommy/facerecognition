import React, { useState } from 'react';
import { 
  Button, Dialog, DialogActions, DialogContent, 
  DialogContentText, DialogTitle, TextField, Box, Typography, Divider 
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

export default function AuthDialog({open, setOpen}) {
  const [isLogin, setIsLogin] = useState(true); // Schalter für Login/Registrierung
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [showPassword, setShowPassword] = useState(false);

const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleClickOpen = () => setOpen(true);
  
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

      console.log('Erfolg:', data);
      handleClose();
      // Hier Token speichern (z.B. localStorage.setItem('token', data.token))
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDemo = () => {
    // Demo-Daten, die deine Zod-Regeln erfüllen (Großbuchstabe + Sonderzeichen)
    setUsername('Demo_Nutzer');
    setPassword('DemoPasswort123!');
    // Optional: Direkt den Login-Trigger nach dem Setzen ausführen
  };

  

  return (
    <React.Fragment>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Anmelden / Registrieren
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
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
          
          <Button onClick={handleClose} color="inherit" sx={{ mt: 1 }}>
            Abbrechen
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}