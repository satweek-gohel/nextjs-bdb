'use client'
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Modal, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AddClientModal from '../components/AddClientModal'; // Adjust the path based on your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarcom from '../components/Navbarcom';
import Sidebarcom from '../components/sidebar';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { BsFillPencilFill, BsFillTrashFill, BsTelephoneFill, BsEnvelopeFill } from 'react-icons/bs'; // Import icons

const CenteredControls = () => (
  <div className="d-flex flex-column align-items-center my-4">
    <Button variant="primary" className="mb-3">Add Client</Button>
    <InputGroup className="global-filter">
      <FormControl
        placeholder="Search........."
      />
    </InputGroup>
  </div>
);

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  return (
    <InputGroup className="global-filter">
      <FormControl
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search...`}
      />
    </InputGroup>
  );
}

const ClientPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editClient, setEditClient] = useState(null);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'clients'));
        const clientsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClients(clientsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients: ', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, [showModal]); // Reload data when modal closes

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'clients', id));
      // Update clients state by filtering out the deleted client
      setClients(prevClients => prevClients.filter(client => client.id !== id));
    } catch (error) {
      console.error('Error deleting client: ', error);
    }
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, 'clients', editClient.id), editClient);
      setClients(clients.map(client => (client.id === editClient.id ? editClient : client)));
      setEditClient(null);
    } catch (error) {
      console.error('Error updating client: ', error);
    }
  };

  const handleCall = (phone) => {
    // Logic for calling the phone number
    console.log('Calling', phone);
  };

  const handleEmail = (email) => {
    // Logic for emailing
    console.log('Emailing', email);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Email',
        accessor: 'email'
      },
      {
        Header: 'Phone Number',
        accessor: 'phone'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <a href={`tel:${row.original.phone}`} className="text-decoration-none me-2" onClick={() => handleCall(row.original.phone)}>
              <BsTelephoneFill />
            </a>
            <a href={`mailto:${row.original.email}`} className="text-decoration-none" onClick={() => handleEmail(row.original.email)}>
              <BsEnvelopeFill />
            </a>
            <BsFillPencilFill
              className="icon ms-2"
              onClick={() => setEditClient(row.original)}
            />
            <BsFillTrashFill
              className="icon ms-2"
              onClick={() => handleDelete(row.original.id)}
            />
          </>
        )
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, globalFilter },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions
  } = useTable(
    {
      columns,
      data: clients,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <>
      
      <Container className="mt-4">
        <Row className="mb-3 justify-content-center">
          <Col xs="auto" className="d-flex justify-content-center mb-2 mb-md-0">
            <Button variant="primary" onClick={() => setShowModal(true)}>Add Client</Button>
          </Col>
          <Col xs="auto" className="d-flex justify-content-center mt-2 mt-md-0">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </Col>
        </Row>
        <AddClientModal show={showModal} handleClose={() => setShowModal(false)} />
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table {...getTableProps()} className="table table-striped table-bordered mt-4">
                <thead>
                  {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                      {headerGroup.headers.map(column => (
                        <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map(row => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={row.id}>
                        {row.cells.map(cell => (
                          <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="pagination d-flex justify-content-center align-items-center mt-3">
              <Button variant="primary" size="sm" className="me-2" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                {'<<'}
              </Button>
              <Button variant="primary" size="sm" className="me-2" onClick={() => previousPage()} disabled={!canPreviousPage}>
                {'<'}
              </Button>
              <span className="mx-2">
                Page{' '}
                <strong>
                  {pageIndex + 1} of {pageOptions.length}
                </strong>{' '}
              </span>
              <Button variant="primary" size="sm" className="ms-2" onClick={() => nextPage()} disabled={!canNextPage}>
                {'>'}
              </Button>
              <Button variant="primary" size="sm" className="ms-2" onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
                {'>>'}
              </Button>
            </div>
          </>
        )}
      </Container>

      {editClient && (
        <Modal show={true} onHide={() => setEditClient(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Client</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editClientName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editClient.name}
                  onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editClientEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={editClient.email}
                  onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editClientPhone">
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  value={editClient.phone}
                  onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditClient(null)}>Close</Button>
            <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default ClientPage;
