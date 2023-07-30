import TextField from "../../../components/TextField/TextField";
import ListItem from "../../../components/ListItem/ListItem";
import { UnitEnumTranslate } from "../../../enums/UnitEnum";
import { useState } from "react";

const WarehouseOrderingList = ({ wItems, onChange }) => {
    const [state, setState] = useState({
        order: {}
    });

    const onInnerChange = (value, item) => {
        value = Math.max(Number(0), Math.min(Number(item.stock), Number(value)));

        let newOrder = {
            ...state.order,
            [item.id]: {
                item,
                quantity: value
            }
        }

        if (!value) {
            delete newOrder[item.id];
        }

        if (onChange && typeof onChange === 'function') {
            onChange(newOrder);
        }

        setState({
            ...state,
            order: newOrder
        });
    }

    return (
        <>
            {
                (wItems || []).map(item => {
                    return (
                        <TextField key={item.id} text={
                            <ListItem left={`${item.name}`} right={
                                <>
                                    <input className="input" style={{ width: '50px', marginRight: '10px' }} value={state.order[item.id]?.quantity || ''} type="number"
                                        min="0" max={item.stock} onChange={(ev) => onInnerChange(ev.target.value, item)} />
                                    <span>{`${item.stock} ${UnitEnumTranslate[item.unit]}`}</span>
                                </>
                            } showKebab={false} />
                        } />
                    );
                })
            }
            {
                !wItems ?
                    <TextField key={1} text={
                        <ListItem left='none' />
                    } /> : <></>
            }
        </>
    );
}

export default WarehouseOrderingList;