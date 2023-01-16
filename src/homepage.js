import { Sort } from "@mui/icons-material";
import { Save } from "@mui/icons-material";
import { Hearing } from "@mui/icons-material";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

export function Homepage({ login }) {
  return (
    <Box id="homepage" sx={{ p: 4 }}>
      <Typography variant="h1" sx={{ pb: 1 }}>
        Sortify
      </Typography>
      <Typography variant="h5" fontWeight="light">
        Please login to start sorting your playlists with ease!
      </Typography>
      <Button
        variant="contained"
        onClick={login}
        size="large"
        sx={{
          backgroundColor: "#1DB954",
          m: 2,
          pt: 2,
          pb: 2,
        }}
      >
        Login with Spotify
      </Button>

      <Box>
        <Typography variant="h5" sx={{ p: 2, pt: 4 }}>
          <Hearing
            style={{
              verticalAlign: "middle",
              display: "inline-flex",
              marginRight: "8",
            }}
          ></Hearing>
          Listen to playlist previews
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ p: 2 }}>
          <Sort
            style={{
              verticalAlign: "middle",
              display: "inline-flex",
              marginRight: "8",
            }}
          ></Sort>
          Sort your songs into tier lists
        </Typography>
      </Box>
      <Box>
        <Typography variant="h5" sx={{ p: 2 }}>
          <Save
            style={{
              verticalAlign: "middle",
              display: "inline-flex",
              marginRight: "8",
            }}
          ></Save>
          Save your changes directly to Spotify
        </Typography>
      </Box>
    </Box>
  );
}
