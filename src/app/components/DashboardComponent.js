import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register the necessary components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DashboardComponent = () => {
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalClients, setTotalClients] = useState(0);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [projectChartData, setProjectChartData] = useState({});
  const [earningsChartData, setEarningsChartData] = useState({});
  const [employeesChartData, setEmployeesChartData] = useState({});
  const [clientsChartData, setClientsChartData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        setTotalProjects(projectsSnapshot.size);
        
        let earnings = 0;
        projectsSnapshot.forEach((doc) => {
          const projectData = doc.data();
          earnings += parseFloat(projectData.budget) || 0;
        });
        setTotalEarnings(earnings);

        const employeesSnapshot = await getDocs(collection(db, 'employees'));
        setTotalEmployees(employeesSnapshot.size);

        const clientsSnapshot = await getDocs(collection(db, 'clients'));
        setTotalClients(clientsSnapshot.size);

        // Prepare chart data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        setProjectChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Projects',
              data: Array(12).fill(projectsSnapshot.size), // Example data, replace with actual monthly data
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              fill: false,
            }
          ]
        });

        setEarningsChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Earnings',
              data: Array(12).fill(earnings), // Example data, replace with actual monthly data
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              fill: false,
            }
          ]
        });

        setEmployeesChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Employees',
              data: Array(12).fill(employeesSnapshot.size), // Example data, replace with actual monthly data
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              fill: false,
            }
          ]
        });

        setClientsChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Clients',
              data: Array(12).fill(clientsSnapshot.size), // Example data, replace with actual monthly data
              borderColor: 'rgba(153, 102, 255, 1)',
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              fill: false,
            }
          ]
        });

        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        console.error('Error fetching data: ', error);
        setLoading(false); // Handle error and set loading to false
      }
    };

    fetchData();
  }, []);

  return (
    
      <Container className="mt-4 dashboard-container rounded">
        {loading ? ( 
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <div className="section grey-background">
              <Row>
                <Col>
                  <Card bg="light" text="dark" className="text-center dashboard-card">
                    <Card.Body>
                      <Card.Title>Total Projects</Card.Title>
                      <Card.Text className='py-2' style={{ color: '#007bff', fontWeight: 'bold' , fontSize:'22px' }}>
                        {totalProjects}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card bg="light" text="dark" className="text-center dashboard-card">
                    <Card.Body>
                      <Card.Title>Total Earnings</Card.Title>
                      <Card.Text  className='py-2' style={{ color: '#007bff', fontWeight: 'bold'  , fontSize:'22px' }}>
                        Rs. {totalEarnings}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card bg="light" text="dark" className="text-center dashboard-card">
                    <Card.Body>
                      <Card.Title>Total Employees</Card.Title>
                      <Card.Text className='py-2' style={{ color: '#007bff', fontWeight: 'bold' , fontSize:'22px' }}>
                        {totalEmployees}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col>
                  <Card bg="light" text="dark" className="text-center dashboard-card">
                    <Card.Body>
                      <Card.Title>Total Clients</Card.Title>
                      <Card.Text className='py-2' style={{ color: '#007bff', fontWeight: 'bold'  , fontSize:'22px'}}>
                        {totalClients}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="section grey-background">
              <Row className="section-title">
               
              </Row>
              <Row>
                <Col md={6}>
                  <Card bg="light" text="dark" className="text-center dashboard-card mb-4">
                    <Card.Body>
                      <Card.Title>Projects Over Time</Card.Title>
                      <Line data={projectChartData} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <div className="white-space"></div>
                  <Card bg="light" text="dark" className="text-center dashboard-card mb-4">
                    <Card.Body>
                      <Card.Title>Earnings Over Time</Card.Title>
                      <Line data={earningsChartData} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="section grey-background">
              <Row className="section-title">
               
              </Row>
              <Row>
                <Col md={6}>
                  <Card bg="light" text="dark" className="text-center dashboard-card mb-4">
                    <Card.Body>
                      <Card.Title>Employees Over Time</Card.Title>
                      <Line data={employeesChartData} />
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <div className="white-space"></div>
                  <Card bg="light" text="dark" className="text-center dashboard-card mb-4">
                    <Card.Body>
                      <Card.Title>Clients Over Time</Card.Title>
                      <Line data={clientsChartData} />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </>
        )}
      </Container>
    
  );
};

export default DashboardComponent;
