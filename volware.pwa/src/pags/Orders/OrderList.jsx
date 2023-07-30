import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import moment from 'moment';

import OrderService from "../../services/OrderService";
import { OrderStatusEnumTranslate } from "../../enums/OrderStatusEnum";
import Actions from "../../components/Actions/Actions";
import ListItem from "../../components/ListItem/ListItem";
import TextField from "../../components/TextField/TextField";
import SearchInput from "../../components/SearchInput/SearchInput";

function OrderList() {
    const navigate = useNavigate();
    const [state, setState] = useState({
        order: [],
        searchTerm: ''
    });

    useEffect(() => {
        OrderService.getFiltered().then((res) => {
            setState({
                ...state,
                orders: res.data.results
            });
        });
    }, []);

    const searchTermChanged = (searchTerm) => {
        setState({ ...state, searchTerm });
        OrderService.getFiltered(searchTerm).then((res) => {
            setState({
                ...state,
                orders: res.data.results
            });
        })
    };

    return (
        <div className="main-container">
            <Actions backUrl={'/'} />

            <h2>Замовлення</h2>

            <div className="col-1">
                <SearchInput callback={searchTermChanged} />
            </div>

            <div style={{ marginTop: '30px' }} />

            {
                (state.orders || []).map(item => {
                    return (
                        <div key={item.id} onClick={() => navigate(`/order/${item.id}`, { state: { backUrl: '/orders' } })}>
                            <TextField text={
                                <ListItem left={`${item.uniqueIdentifier}`} right={`${OrderStatusEnumTranslate[item.status]} ${moment(item.dateCreated).format('hh:mm:ss')}`} />
                            } />
                        </div>
                    );
                })
            }
            {
                !state.orders ?
                    <TextField key={1} text={
                        <ListItem left='none' />
                    } /> : <></>
            }
        </div>
    );
}

export default OrderList;