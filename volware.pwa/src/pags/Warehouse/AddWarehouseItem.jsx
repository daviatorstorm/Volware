import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';

import { debounce } from '../../helpers/utils';

import UnitEnum, { UnitEnumTranslate } from '../../enums/UnitEnum';
import Actions from '../../components/Actions/Actions';
import Autocomplete from '../../components/Autocomplete/Autocomplete';
import WarehouseService from '../../services/WarehouseService';
import TextInput from '../../components/TextInput/TextInput';

const debounceSearch = debounce((callback) => {
    callback();
}, 600);

function AddWarehouseItem() {
    const navigator = useNavigate();
    const location = useLocation();
    const params = useParams();

    const validationObject = {
        name: useRef(null),
        // place: useRef(null),
        stock: useRef(null)
    }

    const [state, setState] = useState({
        name: '',
        place: '',
        selectedUnit: { value: UnitEnum.None, label: UnitEnumTranslate[UnitEnum.None], isdisabled: true },
        unit: UnitEnum.None,
        stock: 0,
        existingId: 0,
        searchItems: [],
        selectInvalid: false
    });

    const unitOptions = [
        { value: UnitEnum.None, label: UnitEnumTranslate[UnitEnum.None] },
        { value: UnitEnum.Liter, label: UnitEnumTranslate[UnitEnum.Liter] },
        { value: UnitEnum.Kilogram, label: UnitEnumTranslate[UnitEnum.Kilogram] },
        { value: UnitEnum.Pallet, label: UnitEnumTranslate[UnitEnum.Pallet] },
        { value: UnitEnum.Box, label: UnitEnumTranslate[UnitEnum.Box] },
        { value: UnitEnum.Bottle, label: UnitEnumTranslate[UnitEnum.Bottle] },
        { value: UnitEnum.Piece, label: UnitEnumTranslate[UnitEnum.Piece] }
    ];

    useEffect(() => {
        if (params['id']) {
            WarehouseService.getById(params['id']).then((res) => {
                const { name, place, unit, stock } = res.data;
                console.log(res.data);
                setState({
                    ...state,
                    name, place, unit, stock,
                    existingId: params['id'],
                    selectedUnit: { value: unit, label: UnitEnumTranslate[unit], isdisabled: true }
                });
            });
        }
    }, []);

    const inputChangeHandler = (el, propertyName) => {
        setState({
            ...state,
            [propertyName]: el.target.value
        });
    }

    const handleRoleSelect = (select) => {
        setState({
            ...state,
            selectedUnit: select,
            unit: select.value
        });
    }

    const handleWarehouseItemSearch = (value) => {
        setState({
            ...state,
            existingId: 0,
            'name': value
        });

        debounceSearch(() => {
            WarehouseService.getWarehouseItemsForDropdown(value).then((res) => {
                setState({
                    ...state,
                    name: value,
                    searchItems: res.data
                });
            });
        });
    };

    const handleSelectedWarehouseItemNameItem = (value) => {
        if (value) {
            WarehouseService.getById(value.id).then((res) => {
                const { name, place, unit, id } = res.data;
                setState({
                    ...state,
                    existingId: id,
                    name, place, unit,
                    selectedUnit: { value: unit, label: UnitEnumTranslate[unit], isdisabled: true }
                });
            });
        }
    }

    const validate = () => {
        let isValid = true;
        for (const iterator of ['name', 'stock']) {
            if (!state[iterator]) {
                validationObject[iterator].current.classList.add('invalid-input');

                isValid = false;
            } else {
                validationObject[iterator].current.classList.remove('invalid-input');
            }
        }

        if (state.unit === UnitEnum.None) {
            setState({
                ...state,
                selectInvalid: true
            });
            isValid = false;
        }

        return isValid;
    }

    const submitWarehouseItem = () => {
        if (!validate()) return;

        if (params['id']) {
            WarehouseService.updateWarehouseItem({
                name: state.name,
                place: state.place,
                stock: state.stock,
                unit: state.unit,
                existingId: params['id']
            }).then(() => {
                navigator('/warehouse');
            });
        } else {
            WarehouseService.addWarehouseItem({
                name: state.name,
                place: state.place,
                stock: state.stock,
                unit: state.unit,
                existingId: state.existingId
            }).then(() => {
                navigator('/warehouse');
            });
        }
    }

    return (
        <div className='main-container'>
            <Actions backUrl={location.state?.backUrl || '/warehouse'} />

            <h2>Новий товар</h2>

            <div className='col-1'>
                <form onSubmit={() => submitWarehouseItem()}>
                    <div className='form-control'>
                        <Autocomplete className="input" suggestions={state.searchItems.map(i => { return { ...i, label: i.name } })}
                            onChange={handleWarehouseItemSearch} onItemSelected={handleSelectedWarehouseItemNameItem} placeholder="Назва"
                            value={state.name} ref={validationObject.name} />
                    </div>

                    <div className='form-control col-1'>
                        <TextInput type='text' name="place" placeholder='Місце'
                            value={state.place} onChange={(el) => inputChangeHandler(el, 'place')} ref={validationObject.place} />
                    </div>

                    <div className='flex'>
                        <div className='form-control col-1'>
                            <TextInput type='number' name="stock" placeholder='Кількість'
                                value={state.stock} onChange={(el) => inputChangeHandler(el, 'stock')} ref={validationObject.stock} />
                        </div>

                        <div className='form-control'>
                            <Select
                                className='react-select'
                                value={state.selectedUnit}
                                options={unitOptions}
                                onChange={handleRoleSelect}
                                name='role'
                                placeholder='Роль'
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        'borderColor': state.selectInvalid ?
                                            'red' : 'initial'
                                    })
                                }} />
                        </div>
                    </div>

                    <div className='form-control flex'>
                        <div className='col-center text-center col-1'>
                            <button type='button' className='btn' onClick={() => submitWarehouseItem()}>Зберегти</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddWarehouseItem;
