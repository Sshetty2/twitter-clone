import { Authenticator } from '@aws-amplify/ui-react';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import TwitterHome from './components/TwitterHome';

import '@aws-amplify/ui-react/styles.css';

const theme = createTheme({
  palette: {
    primary   : { main: '#1DA1F2' }, // Twitter blue,
    background: { default: '#ffffff' }
  }
});

function App () {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Authenticator>
        {({ signOut, user }) => (
          <Box sx={{ height: '100vh' }}>
            <TwitterHome
              user={user}
              signOut={signOut} />
          </Box>
        )}
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
