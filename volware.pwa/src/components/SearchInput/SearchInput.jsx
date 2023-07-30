import { debounce } from '../../helpers/utils';

const SearchInput = ({ callback }) => {
    const debounceSearch = debounce((searchTerm) => {
        callback(searchTerm);
    }, 600);

    const searchTermChanged = (el) => {
        const searchTerm = el.target.value;
        debounceSearch(searchTerm);
    };

    return (<input className='input search-bar' placeholder='Пошук' onChange={(el) => searchTermChanged(el)} />);
}

export default SearchInput;
