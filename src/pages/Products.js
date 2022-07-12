import { filter } from 'lodash';
import { useEffect, useState } from 'react';
import axios from 'axios';
// import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  TextField,
  TableHead,
} from '@mui/material';
// components
import Page from '../components/Page';
import Scrollbar from '../components/Scrollbar';
import Iconify from '../components/Iconify';
import SearchNotFound from '../components/SearchNotFound';
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock

import './translate.css'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'selector', label: 'SELECTOR', alignRight: false },
  { id: 'english', label: 'ENGLISH', alignRight: false },
  { id: 'spanish', label: 'SPANISH', alignRight: false },
  { id: 'french', label: 'FRENCH', alignRight: false },
  { id: 'date', label: 'DATE', alignRight: false },
  { id: 'tools', label: 'TOOLS', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.selector.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function Products() {
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('selector');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // tables.
  const [user, setUser] = useState([]);
  const [selector, setSelector] = useState('');
  const [msg, segMsg] = useState('');
  const [select, setSelect] = useState();
  const [spanish, setSpanish] = useState();
  const [french, setFrench] = useState();

  // selects
  const [selects, setSelects] = useState([]);

  useEffect(() => {
    getSelector();
    getSelects();
  }, [msg]);

  const createSelector = async () => {
    try {
      const res = await axios.post('http://localhost:5000/select', {
        "selector": selector,
      });
      alert(res.data.msg);
    } catch (error) {
      segMsg(error.response.data.msg);
    }
  };

  const getSelector = async () => {
    try {
      const res = await axios.get('http://localhost:5000/users');
      setUser(res.data);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data.msg);
      }
    }
  };

  const Update = async (id) => {
    try {
      const res = await axios.put('http://localhost:5000/update', {
        'id': id,
        'selector': select,
        'french': french,
        'spanish': spanish,
      });
      alert(res.data.msg);
    } catch (error) {
      if (error.response) {
        alert(error.response.data.msg);
      }
    }
  };

  const Delete = async (english) => {
    console.log(english);
    try {
      const res = await axios.delete('http://localhost:5000/delete', {
        data: { english },
      });
    } catch (error) {
      console.log(error.response.data.msg);
    }
    window.location.reload();
  };

  // selects
  const getSelects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/selector');
      setSelects(response.data);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const Deletes = async(selector) => {
    try{
      const res = await axios.delete('http://localhost:5000/select', {
        data: { selector },
      });
    } catch (error) {
      console.log(error.response.data.msg);
    }
    }
  

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = user.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - user.length) : 0;

  const filteredUsers = applySortFilter(user, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="Products">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Translate
          </Typography>
          <TextField
            label={'selectors'}
            id="margin-none"
            onChange={(e) => {
              setSelector(e.target.value);
            }}
          />
          {console.log(selector)}
          <Button
            variant="contained"
            color="error"
            size="large"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={createSelector}
          >
            New User
          </Button>
        </Stack>

        <Card>
          <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={user.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { id, selector, english, spanish, french, date } = row;
                    const isItemSelected = selected.indexOf(id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                        </TableCell>
                        <TableCell align="center">
                          <textarea onChange={(e) => setSelect(e.target.value)} defaultValue={selector} />
                        </TableCell>
                        <TableCell align="center">{english}</TableCell>
                        <TableCell align="center">
                          <textarea onChange={(e) => setSpanish(e.target.value)} defaultValue={spanish} />
                        </TableCell>
                        <TableCell align="center">
                          <textarea onChange={(e) => setFrench(e.target.value)} defaultValue={french} />
                        </TableCell>
                        <TableCell align="center">{date}</TableCell>
                        <TableCell align="center" className='button-groups'>
                          <Button variant="contained" color="success" size="small" onClick={() => Update(id)}>
                            Update
                          </Button>
                          <Button variant="contained" size="small" onClick={() => Delete(english)}>
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={user.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
      <Container>
        <Table sx={{ maxWidth: 450 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="center">Main Select</TableCell>
              <TableCell align="center">Tools</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {selects.map((row, index) => (
              <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {row.selector}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  <Button variant="contained" size="small" onClick={() => Deletes(row.selector)}>
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
