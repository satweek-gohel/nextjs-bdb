'use client'

import React, { useState, useEffect } from 'react';
import { Container, Button, Spinner, Modal, Form, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import { db } from '../config/firebase'; // Adjust the path based on your project structure
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import AddProjectModal from '../components/AddProjectModal'; // Adjust the path based on your project structure
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
    <InputGroup className="global-filter" style={{ maxWidth: '300px' }}>
      <FormControl
        value={globalFilter || ''}
        onChange={e => {
          setGlobalFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search...`}
        className="search-bar"
      />
    </InputGroup>
  );
}

const ProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const handleCloseSidebar = () => setShowSidebar(false);
  const handleShowSidebar = () => setShowSidebar(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects: ', error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, [showModal]); // Reload data when modal closes

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects(projects => projects.filter(project => project.id !== id));
    } catch (error) {
      console.error('Error deleting project: ', error);
    }
  };

  const handleEditSave = async () => {
    try {
      await updateDoc(doc(db, 'projects', editProject.id), editProject);
      setProjects(projects.map(project => (project.id === editProject.id ? editProject : project)));
      setEditProject(null);
    } catch (error) {
      console.error('Error updating project: ', error);
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Project Name',
        accessor: 'projectName'
      },
      {
        Header: 'Client Name',
        accessor: 'clientName'
      },
      {
        Header: 'Technology',
        accessor: 'technology'
      },
      {
        Header: 'Budget',
        accessor: 'budget'
      },
      {
        Header: 'Employee Assigned',
        accessor: 'employee' // Accessor for the employee field
      },
      {
        Header: 'Remark',
        accessor: 'remark'
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <span style={{ color: value === 'Completed' ? 'green' : 'red' }}>
            {value}
          </span>
        )
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        Cell: ({ row }) => (
          <>
            <BsFillPencilFill
              className="icon"
              onClick={() => setEditProject(row.original)}
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
      data: projects,
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
          <Col xs={12} md={8} className="d-flex justify-content-center align-items-center mb-2 mb-md-0">
            <Button variant="primary" className="me-2" onClick={() => setShowModal(true)}>Add Project</Button>
            <GlobalFilter
              preGlobalFilteredRows={preGlobalFilteredRows}
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          </Col>
        </Row>
        <AddProjectModal show={showModal} handleClose={() => setShowModal(false)} />
        {loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table {...getTableProps()} className="table table-striped table-bordered mt-4">
                <thead>
                  {headerGroups.map((headerGroup, headerGroupIndex) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
                      {headerGroup.headers.map((column, columnIndex) => (
                        <th {...column.getHeaderProps()} key={columnIndex}>{column.render('Header')}</th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, rowIndex) => {
                    prepareRow(row);
                    return (
                      <tr {...row.getRowProps()} key={rowIndex}>
                        {row.cells.map((cell, cellIndex) => (
                          <td {...cell.getCellProps()} key={cellIndex}>{cell.render('Cell')}</td>
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

      {editProject && (
        <Modal show={true} onHide={() => setEditProject(null)}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editProjectName">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.projectName}
                  onChange={(e) => setEditProject({ ...editProject, projectName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editClientName">
                <Form.Label>Client Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.clientName}
                  onChange={(e) => setEditProject({ ...editProject, clientName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editTechnology">
                <Form.Label>Technology</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.technology}
                  onChange={(e) => setEditProject({ ...editProject, technology: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editBudget">
                <Form.Label>Budget</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.budget}
                  onChange={(e) => setEditProject({ ...editProject, budget: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editEmployee">
                <Form.Label>Employee Assigned</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.employee}
                  onChange={(e) => setEditProject({ ...editProject, employee: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editRemark">
                <Form.Label>Remark</Form.Label>
                <Form.Control
                  type="text"
                  value={editProject.remark}
                  onChange={(e) => setEditProject({ ...editProject, remark: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="editStatus">
                <Form.Label>Status</Form.Label>
                <Form.Control
                  as="select"
                  value={editProject.status}
                  onChange={(e) => setEditProject({ ...editProject, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditProject(null)}>Close</Button>
            <Button variant="primary" onClick={handleEditSave}>Save Changes</Button>
          </Modal.Footer>
        </Modal>
      )}
    </ProtectedRoute>
  );
};

export default ProjectPage;
