import * as React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';
import {
  TextField,
  Stack,
  Button,
  Container,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  OutlinedInput,
  InputLabel,
  Typography,
  MenuItem,
  FormControl,
  Select,
  Chip,
} from '@mui/material';

import Page from '../components/Page';
import Iconify from '../components/Iconify';

// Languages
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = ['English', 'Spanish', 'French', 'German', 'Italian'];

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
  };
}

export default function DashboardApp() {
  // languages
  const theme = useTheme();
  const [personName, setPersonName] = React.useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const [msg, setMsg] = useState('');
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    getDomain();
  }, [msg]);

  const Register = async () => {
    try {
      const res = await axios.post('http://localhost:5000/domain', {
        'domain': domain,
      });
      alert(res.data.msg);
    } catch (error) {
      setMsg(error.response.data.msg);
    }
  };

  const getDomain = async () => {
    try {
      const response = await axios.get('http://localhost:5000/domain');
      setDomains(response.data);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const deleteDomain = async (domain) => {
    try {
      const res = await axios.delete('http://localhost:5000/domain', {
        data: { domain },
      });
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  return (
    <Page title="DashboardApp">
      <Container>
        <Stack direction="row" alignItems="center" mb={5}>
          <TextField
            helperText="Please enter your project name"
            id="demo-helper-text-aligned"
            label="Project"
            sx={{ mr: 5 }}
          />
          <Button variant="contained" color="error" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
            Create
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" mb={5}>
          <TextField
            helperText="Please enter your domain name"
            id="demo-helper-text-aligned"
            label="Domain"
            sx={{ mr: 5 }}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={Register}
          >
            Create
          </Button>
        </Stack>
        <Stack direction="row" alignItems="center" mb={5}>
          <FormControl sx={{ mr: 5, width: 220 }} >
            <InputLabel id="demo-multiple-chip-label">Language</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChange}
              input={<OutlinedInput id="select-multiple-chip" label="Language" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem key={name} value={name} style={getStyles(name, personName, theme)}>
                  {name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="error" size="large" startIcon={<Iconify icon="eva:plus-fill" />}>
            Create
          </Button>
        </Stack>
      </Container>
      <Container>
        <Table sx={{ maxWidth: 450 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="center">Domain URL</TableCell>
              <TableCell align="center">Tools</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {domains.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {row.domain}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  <Button variant="contained" size="small" onClick={() => deleteDomain(row.domain)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </Page>
  );
}
