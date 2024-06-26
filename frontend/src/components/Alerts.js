import Alert from 'react-bootstrap/Alert';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


export default function Alerts ({error})  {

    return (
        <>
            <Alert key={'danger'} variant={'danger'}>
              {error}
            </Alert>
          
        </>
      );
}

export function Success ({success})  {

  return (
      <>
          <Alert key={'success'} variant={'success'}>
            {success}
          </Alert>
        
      </>
    );
  }
export function Toasts ({error, type, onClose}) {
  
  return (
      
      <>
        <ToastContainer
          className="p-3"
          position={'top-center'}
          style={{ zIndex: 1 }}
        >
          <Toast bg= {type === 'Success'? 'success' :'danger'} onClose={onClose}>
            <Toast.Header closeButton={true}>
              
              <strong className="me-auto">{type}</strong>
          
            </Toast.Header>
            <Toast.Body>{error}</Toast.Body>
          </Toast>
        </ToastContainer>
      </>
        
      
    );
}
