import React from "react";
import { useHistory } from "react-router-dom";
import Order from "../Order/Order";

const OrdersCardView = (props) => {
    const history = useHistory();
    if(!props.orders || !props.orders.length){
        return <div>No Orders found</div>
    }
    return (
        <div style={{marginRight: "10%", marginLeft: "10%"}}>
            {
                props.orders.map((order, i) => {
                    return (

                        <Order
                            key={order.id} /* order.idOrder */
                            order={order}
                            onClick={() => {
                                history.push(`/vieworder/${order.id}`, 
                                    { orderObj: order }
                                );
                            }}
                        />
                    )
                })
            }
        </div>
    );
};

export default OrdersCardView;