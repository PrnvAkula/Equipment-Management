import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from './Logo';

function TabsExample() {
    function handleSignOut() {
        sessionStorage.removeItem('authToken');
        window.location.reload();
    }
    return (
        <Container fluid className="navbar-bg">
            <Row className="align-items-center"> 
                <Col xs="auto" className="d-flex align-items-center"> 
                    <Logo />
                </Col>
                <Col>
                    <Nav variant="tabs" defaultActiveKey="/home" > 
                        <Nav.Item>
                            <Nav.Link href="/staffhome" className="custom-nav-link">View Bookings</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link href="/changeequipment" className="custom-nav-link">Manage Equipment</Nav.Link>
                        </Nav.Item>
                    </Nav>
                </Col>
                <Col xs="auto">
                    <Button variant="outline-danger" id="signOutButton" onClick={handleSignOut}>Log Out</Button>
                </Col>
            </Row>
        </Container>
    );
}

export default TabsExample;