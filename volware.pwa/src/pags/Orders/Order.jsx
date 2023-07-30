import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import ReactSelect from "react-select";

import Actions from "../../components/Actions/Actions";
import ListItem from "../../components/ListItem/ListItem";
import TextField from "../../components/TextField/TextField";
import DeliveryTypeEnum, { DeliveryTypeEnumTranslate } from "../../enums/DeliveryTypeEnum";
import { UnitEnumTranslate } from "../../enums/UnitEnum";
import { UserRoleEnumTranslate } from "../../enums/UserRoleEnum";
import OrderService from "../../services/OrderService";

function Order() {
    const params = useParams();
    const [state, setState] = useState({
        order: null,
        selectedDelivery: null,
        delivery: 0,
        description: ''
    });
    const location = useLocation();

    const options = [
        { value: DeliveryTypeEnum.None, label: DeliveryTypeEnum[DeliveryTypeEnum.None] },
        { value: DeliveryTypeEnum.OnHands, label: DeliveryTypeEnum[DeliveryTypeEnum.OnHands] },
        { value: DeliveryTypeEnum.Security, label: DeliveryTypeEnum[DeliveryTypeEnum.Security] }
    ];

    useEffect(() => {
        OrderService.getById(params['id']).then((res) => {
            setState({
                ...state,
                order: res.data
            });
        });
    }, []);

    const handleDeliveryTypeChange = (value) => {
        setState({
            ...state,
            selectedDelivery: value,
            delivery: value.value
        });
    }

    const handleSaveDelivery = () => {
        OrderService.setOrderDelivery(state.order.id, {
            deliveryType: state.delivery,
            description: state.description
        }).then(() => {
            window.location.reload();
        });
    }

    const handleInputChange = (el, propName) => {
        setState({
            ...state,
            [propName]: el.target.value
        });
    }

    return (
        <div className="main-container">
            <Actions backUrl={location.state?.backUrl || '/'} />

            <h2>Замовлення</h2>
            <div className="flex">
                <div className="col-1 rows">
                    {
                        state.order ?
                            <>
                                <div>
                                    <h3 className="text-center">{state.order.uniqueIdentifier}</h3>
                                    <h4>Товари:</h4>
                                    {
                                        state.order.orderItems.map((item, index) =>
                                            <TextField key={index} text={
                                                <ListItem left={`${item.name}`} right={`${item.quantity} ${UnitEnumTranslate[item.unit]}`} showKebab={false} />
                                            } />
                                        )
                                    }
                                </div>
                                <div style={{ marginTop: '20px' }} />
                                <div className="col-1">
                                    <TextField text={
                                        <ListItem left={`${state.order.createdBy.firstName} ${state.order.createdBy.lastName}`}
                                            right={`${UserRoleEnumTranslate[state.order.createdBy.role]}`} showKebab={false} />
                                    } />
                                </div>
                                <div style={{ marginTop: '20px' }} />
                                <h3 id="order-delivery">Доставка:</h3>
                                {
                                    !state.order.delivery ?
                                        <div>
                                            <ReactSelect className="react-select" value={state.selectedDelivery} options={options} onChange={handleDeliveryTypeChange} />
                                        </div> : ''
                                }
                            </>
                            :
                            <p>Ніц нема</p>
                    }
                    {
                        state.delivery === DeliveryTypeEnum.OnHands && !state.order.delivery ?
                            <div>
                                <form>
                                    <div className="form-control">
                                        <textarea className="textaria" style={{ width: '100%', resize: 'none' }} rows="13"
                                            value={state.description} onChange={(el) => handleInputChange(el, 'description')}></textarea>
                                    </div>
                                    <div style={{ marginTop: '20px' }} />
                                    <div className="text-right">
                                        <button type="button" className="btn" onClick={(el) => handleSaveDelivery(el)}>Зберегти</button>
                                    </div>
                                </form>
                            </div>
                            : ''
                    }
                    {
                        state.order && state.order.delivery ?
                            <div>
                                <h4>{DeliveryTypeEnumTranslate[state.order.delivery]}</h4>
                                <p>{state.order.delivery.description}</p>
                            </div>
                            : ''
                    }
                </div>
            </div>
        </div >
    );
}

export default Order;