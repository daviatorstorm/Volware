import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import ListItem from "../../components/ListItem/ListItem";
import TextField from "../../components/TextField/TextField";
import SearchInput from "../../components/SearchInput/SearchInput";
import ActionLogService from "../../services/ActionLogService";
import Actions from "../../components/Actions/Actions";
import ActionLogListItem from "./ActionLogListItem";
import ActionTypeEnum from "../../enums/ActionTypeEnum";

function ActionsLog() {
    const navigate = useNavigate();
    const location = useLocation();
    const [state, setState] = useState({
        actions: [],
        searchTerm: ''
    });

    useEffect(() => {
        ActionLogService.getFiltered().then((res) => {
            console.log(res.data.results);

            setState({
                ...state,
                actions: res.data.results
            });
        });
    }, []);

    const searchTermChanged = (searchTerm) => {
        setState({ ...state, searchTerm });
        ActionLogService.getFiltered(searchTerm).then((res) => {
            setState({
                ...state,
                actions: res.data.results
            });
        })
    };

    const handleClick = (item) => {
        switch (item.actionType) {
            case ActionTypeEnum.AddWarehouseItem:
            case ActionTypeEnum.UpdateWarehouseItem:
                navigate(`/warehouse/${item.entityId}`, { state: { backUrl: '/actions', existingId: item.entityId } });
                break;
            case ActionTypeEnum.CreateOrder:
            case ActionTypeEnum.StartOrderDelivery:
            case ActionTypeEnum.FinishOrderDelivery:
                navigate(`/order/${item.entityId}`, { state: { backUrl: '/actions' } });
                break;
            case ActionTypeEnum.AddUser:
                navigate(`/users/${item.entityId}`, { state: { backUrl: '/actions' } });
                break;

            default:
                break;
        }
    }

    return (
        <div className="main-container">
            <Actions backUrl={location.state?.backUrl || '/'} />

            <h2>Журнал активності</h2>

            <div className="col-1">
                <SearchInput callback={searchTermChanged} />
            </div>

            <div style={{ marginTop: '30px' }} /><div style={{ marginTop: '30px' }} />

            {
                (state.actions || []).map((item, index) => {
                    return (
                        <div key={index} onClick={el => handleClick(item)}>
                            <ActionLogListItem item={item} />
                        </div>
                    );
                })
            }
            {
                !state.actions ?
                    <TextField key={1} text={
                        <ListItem left='none' showKebab={false} />
                    } /> : <></>
            }
        </div>
    );
}

export default ActionsLog;