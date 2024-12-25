import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  List,
  ListItem,
  Divider
} from '@mui/material';
import { Send as SendIcon, Favorite, LogoutOutlined } from '@mui/icons-material';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';
import { AuthUser } from 'aws-amplify/auth';

const client = generateClient<Schema>();

interface TwitterHomeProps {
  user?: AuthUser;
  signOut?: () => void;
}

export default function TwitterHome ({ user, signOut }: TwitterHomeProps) {
  const [tweets, setTweets] = useState<any[]>([]);
  const [newTweet, setNewTweet] = useState('');

  const handlePostTweet = useCallback(
    async () => {
      if (!user?.userId) {
        return;
      }

      if (!newTweet.trim()) {
        return;
      }

      try {
        await client.models.Tweet.create({
          content  : newTweet,
          author   : user.userId,
          createdAt: new Date().toISOString()
        });
        setNewTweet('');
        fetchTweets();
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    }, [newTweet, user?.userId]
  );

  useEffect(() => {
    fetchTweets();
  }, []);

  if (!user?.userId) {
    return null;
  }

  async function fetchTweets () {
    try {
      const { data } = await client.models.Tweet.list();
      setTweets(data);
    } catch (error) {
      console.error('Error fetching tweets:', error);
    }
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}>
            Twitter Clone
          </Typography>
          <IconButton
            color="inherit"
            onClick={signOut}>
            <LogoutOutlined />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{ mt: 4 }}>
        <Paper sx={{
          p : 2,
          mb: 4
        }}>
          <Box sx={{
            display: 'flex',
            gap    : 2
          }}>
            <Avatar>{user.username.toUpperCase()}</Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="What's happening?"
                value={newTweet}
                onChange={e => setNewTweet(e.target.value)}
                variant="outlined"
              />
              <Box sx={{
                display       : 'flex',
                justifyContent: 'flex-end',
                mt            : 2
              }}>
                <Button
                  variant="contained"
                  endIcon={<SendIcon />}
                  onClick={handlePostTweet}
                  disabled={!newTweet.trim()}
                >
                  Tweet
                </Button>
              </Box>
            </Box>
          </Box>
        </Paper>

        <List>
          {tweets.map((tweet, index) => (
            <Box key={tweet.id}>
              <ListItem>
                <Box sx={{ width: '100%' }}>
                  <Box sx={{
                    display   : 'flex',
                    alignItems: 'center',
                    gap       : 2,
                    mb        : 1
                  }}>
                    <Avatar>{tweet.author[0].toUpperCase()}</Avatar>
                    <Typography variant="subtitle2">{tweet.author}</Typography>
                    <Typography
                      variant="caption"
                      color="text.secondary">
                      {new Date(tweet.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ ml: 7 }}>
                    {tweet.content}
                  </Typography>
                  <Box sx={{
                    ml        : 7,
                    mt        : 1,
                    display   : 'flex',
                    alignItems: 'center'
                  }}>
                    <IconButton size="small">
                      <Favorite fontSize="small" />
                    </IconButton>
                    <Typography variant="caption">{tweet.likes || 0}</Typography>
                  </Box>
                </Box>
              </ListItem>
              {index < tweets.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Container>
    </Box>
  );
}
