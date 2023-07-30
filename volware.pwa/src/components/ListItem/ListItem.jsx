const ListItem = ({ left, right, showKebab = true }) => {
    return (
        <div className="flex row-center col-between">
            <span>{left}</span>
            <div className="flex row-center">
                <span style={{ marginRight: '9px' }}>{right}</span>
                {showKebab && <img src="/Kebab.svg" alt="kebab" />}
            </div>
        </div>
    );
}

export default ListItem;
