import moment from "moment";

import ListItem from "../../components/ListItem/ListItem";
import TextField from "../../components/TextField/TextField";
import { ActionTypeEnumTranslate } from "../../enums/ActionTypeEnum";

function ActionLogListItem({ item, OnClick }) {
    return (
        <TextField text={
            <ListItem onClick={OnClick} left={`${item.initiator.firstName} ${item.initiator.lastName}`}
                right={`${ActionTypeEnumTranslate[item.actionType]} ${moment(item.dateCreated).format('hh:mm:ss')}`} />
        } />
    )
}

export default ActionLogListItem;