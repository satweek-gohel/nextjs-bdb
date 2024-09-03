'use client'
import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Modal, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AddEmployeeModal from '../components/AddEmployeeModal'; // Adjust the path based on your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbarcom from '../components/Navbarcom';
import Sidebarcom from '../components/sidebar';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import { BsFillPencilFill, BsFillTrashFill } from 'react-icons/bs'; // Import icons
import ProtectedRoute from '../components/ProtectedRoute';

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
        placeholder={`Search.......`}
      />
    </InputGroup>
  );
}

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'employees'));
        const employeesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEmployees(employeesList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching employees: ', error);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, [showModal]); // Reload data when modal closes

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'employees', id));
      // Update state to remove the deleted employee
      setEmployees(prevEmployees => prevEmployees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee: ', error);
    }
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, 'employees', editEmployee.id), editEmployee);
      setEmployees(employees.map(emp => (emp.id === editEmployee.id ? editEmployee : emp)));
      setEditEmployee(null);
    } catch (error) {
      console.error('Error updating employee: ', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name'
      },
      {
        Header: 'Designation',
        accessor: 'designation'
      },
      {
        Header: 'Technology',
        accessor: 'technology'
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <BsFillPencilFill
              className="icon"
              onClick={() => setEditEmployee(row.original)}
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
      data: employees,
      initialState: { pageIndex: 0 }
    },
    useGlobalFilter,
    usePagination
  );

  return (
    <ProtectedRoute>
      <Navbarcom handleShow={handleShowSidebar} />
      <Sidebarcom show={showSidebar} handleClose={handleCloseSidebar} />
      <Container className="mt-4">
        <Row className="mb-3 justify-content-center">
          <Col xs="auto" className="mb-2 mb-md-0">
            <Button variant="primary" onClick={() => setShowModal(true)}>Add Employee</Button>
          </Col>
          <Col xs="auto" className="d-flex justify-content-center">
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </Col>
        </Row>
        <AddEmployeeModal show={showModal} handleClose={() => setShowModal(false)} />
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

      {editEmployee && (
        <Modal show={true} onHide={() => setEditEmployee(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Employee</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editEmployeeName">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.name}
                  onChange={(e) => setEditEmployee({ ...editEmployee, name: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editEmployeeDesignation">
                <Form.Label>Designation</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.designation}
                  onChange={(e) => setEditEmployee({ ...editEmployee, designation: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editEmployeeTechnology">
                <Form.Label>Technology</Form.Label>
                <Form.Control
                  type="text"
                  value={editEmployee.technology}
                  onChange={(e) => setEditEmployee({ ...editEmployee, technology: e.target.value })}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditEmployee(null)}>Close</Button>
            <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </ProtectedRoute>
  );
};

export default EmployeesPage;
