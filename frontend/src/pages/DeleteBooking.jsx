import TabsExample from '../components/Nav';

import DeleteTable from '../components/DeleteTable';





function DeleteBooking(){

    return (
        <>
        <TabsExample op1={'View Bookings'} op2={'Statistical Data'} op3= {'Manage Equipment'} op4= {'Edit Bookings'} op1href={'/staffhome'} op2href={'/stats'} op3href={'/manageequipment'} op4href={'/deletebooking'} />
        <DeleteTable />

        

        </>
    )
}

export default DeleteBooking;