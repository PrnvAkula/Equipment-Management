import TabsExample from "../components/Nav";
import { decode as base64_decode } from 'base-64';
function ManageEquipment() {
    const username = base64_decode(sessionStorage.getItem('authToken'));
    console.log(username);
    return (
        <>
            <TabsExample op1={'View Bookings'}
                op2={'Manage Equipment'}
                op1href={'/staffhome'}
                op2href={'/manageequipment'} />
        </>
    );
}

export default ManageEquipment;