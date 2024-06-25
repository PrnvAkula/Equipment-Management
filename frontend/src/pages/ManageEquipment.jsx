import TabsExample from "../components/Nav";

function ManageEquipment() {
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