import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ReactModal from 'react-modal';

import WarehouseService from '../../services/WarehouseService';
import OrderService from '../../services/OrderService';
import WarehouseItemList from './WarehouseItemList/WarehouseItemList';
import Actions from '../../components/Actions/Actions';
import SearchInput from '../../components/SearchInput/SearchInput';
import WarehouseOrderingList from './WarehouseOrderingList/WarehouseOrderingList';
import { UnitEnumTranslate } from '../../enums/UnitEnum';
import TextField from '../../components/TextField/TextField';
import ListItem from '../../components/ListItem/ListItem';

ReactModal.setAppElement('#root');

function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        wItems: [],
        searchTerm: '',
        orderingMode: false,
        orderPreview: false,
        order: {},
        orderItems: []
    });

    useEffect(() => {
        WarehouseService.getWarehouseItems().then((response) => {
            setState({
                ...state,
                wItems: response.data.results
            });
        });
    }, []);

    const searchTermChanged = (searchTerm) => {
        setState({ ...state, searchTerm });
        WarehouseService.getWarehouseItems(searchTerm).then((response) => {
            setState({
                ...state,
                wItems: response.data.results
            });
        })
    };

    const addWarehouseItem = () => {
        navigate('/warehouse/addItem');
    }

    const onOrderChange = (newOrder) => {
        setState({
            ...state,
            order: newOrder
        });
    }

    const changeMode = () => {
        setState({
            ...state,
            orderingMode: true,
            orderingBucket: []
        });
    }

    const cancelOrdering = () => {
        setState({
            ...state,
            orderingMode: false,
            orderingBucket: null,
            order: {}
        });
    }

    const previewOrder = () => {
        const orderItems = [];

        for (const propId in state.order) {
            if (Object.hasOwnProperty.call(state.order, propId)) {
                const element = state.order[propId];

                orderItems.push({
                    ...element.item,
                    quantity: element.quantity
                });
            }
        }

        setState({
            ...state,
            orderPreview: true,
            orderItems
        });
    }

    const handleCloseModal = () => {
        setState({
            ...state,
            orderPreview: false
        });
    }

    const handleOrderSave = () => {
        OrderService.addOrder(state.orderItems).then((res) => {
            navigate(`/order/${res.data.id}`, { state: { backUrl: location.pathname } });
        });
    }

    const handleClick = (item) => {
        navigate(`/warehouse/${item.id}`)
    }

    return (
        <div className='main-container'>
            <div>
                {
                    state.orderingMode ?
                        <Actions left={
                            <img src="/x-cross.svg" width="23px" height="22px" alt="add" onClick={cancelOrdering} />
                        } right={
                            <img src="/check-mark.svg" width="23px" height="22px" alt="add" onClick={previewOrder} />
                        } />
                        :
                        <Actions right={
                            <img src="/shopping-cart.svg" width="23px" height="22px" alt="add" onClick={changeMode} />
                        } backUrl={'/'} withAddBtn={true} addFunc={addWarehouseItem} />
                }

                <h2>Склад</h2>

                <div className='col-1'>
                    <SearchInput callback={searchTermChanged} />
                </div>

                <div style={{ marginTop: '30px' }} />
                {
                    state.orderingMode ?
                        <WarehouseOrderingList wItems={state.wItems} onChange={onOrderChange} />
                        :
                        <WarehouseItemList onClick={(item) => handleClick(item)} wItems={state.wItems} />
                }

                <ReactModal className="modal-content" isOpen={state.orderPreview} contentLabel="Order" portalClassName="order-modal">
                    <div className='flex'>
                        <div className='col-1 text-left'>
                            <button type='button' className='btn' onClick={() => handleCloseModal()}>Закрити</button>
                        </div>
                        <div className='col-1 text-right'>
                            <button type='button' className='btn' onClick={() => handleOrderSave()}>Зберегти</button>
                        </div>
                    </div>
                    <h2 className='text-center'>Order</h2>
                    <div className='flex rows'>
                        <div className="rows" style={{ height: '100%' }}>
                            {
                                state.orderItems.map((item) => (
                                    <TextField key={item.id} text={
                                        <ListItem left={`${item.name}`} right={`${item.quantity} ${UnitEnumTranslate[item.unit]}`} showKebab={false} />
                                    } />
                                ))
                            }
                        </div>
                    </div>
                </ReactModal>
            </div>
        </div>
    );
}

export default Warehouse;
