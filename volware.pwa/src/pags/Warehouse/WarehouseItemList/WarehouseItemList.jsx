import TextField from "../../../components/TextField/TextField";
import ListItem from "../../../components/ListItem/ListItem";
import { UnitEnumTranslate } from "../../../enums/UnitEnum";

const WarehouseItemList = ({ wItems, onClick }) => {
    return (
        <>
            {
                (wItems || []).map(item => {
                    return (
                        <div key={item.id} onClick={() => onClick(item)}>
                            <TextField text={
                                <ListItem left={`${item.name}`} right={`${item.stock} ${UnitEnumTranslate[item.unit]}`} />
                            } />
                        </div>
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

export default WarehouseItemList;