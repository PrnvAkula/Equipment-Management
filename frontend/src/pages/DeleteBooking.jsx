import TabsExample from '../components/Nav';

function DeleteBooking(){
    return (
        <>
        <TabsExample op1 = {'Book Equipment'} 
            op2= {'Delete Booking'}
            op1href = {'/doctorhome'}
            op2href = {'/deletebooking'} />
        </>
    )
}

export default DeleteBooking;