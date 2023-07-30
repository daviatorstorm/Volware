import { useEffect, useState, forwardRef } from "react";

import './Autocomplete.scss';

let outsideState = {};
let outsideSetState = () => { };

/**
 * Autocomplete is not react-select. It gives posibility to leave written value in input
 * without selecting it from dropdown. Otherwise select value from dropdown
 */
function Autocomplete({ suggestions, onChange, onItemSelected, placeholder, className, value }, ref) {
    const [state, setState] = useState({
        activeSuggestion: 0,
        showSuggestions: false,
        userInput: value || '',
        selectedValue: null,
        value
    });

    outsideState = state;
    outsideSetState = setState;

    useEffect(() => {
        document.body.addEventListener('click', (ev) => {
            if (outsideState.showSuggestions &&
                !ev.path.find((el) => el.className === 'dropdown')) {
                outsideSetState({
                    ...outsideState,
                    showSuggestions: false
                });
            }
        });
    }, []);

    const onInternalChange = (e) => {
        const userInput = e.currentTarget.value;

        if (state.selectedValue && onItemSelected &&
            typeof onItemSelected === 'function') {
            onItemSelected(null);
        }

        if (onChange && typeof onChange === 'function') {
            onChange(userInput);
        }

        setState({
            ...state,
            activeSuggestion: 0,
            showSuggestions: true,
            userInput: userInput,
            selectedValue: null,
            value: userInput
        });
    };

    const onClick = (e, value) => {
        if (onItemSelected && typeof onItemSelected === 'function') {
            onItemSelected(value);
        }

        setState({
            ...state,
            activeSuggestion: 0,
            showSuggestions: false,
            userInput: e.currentTarget.innerText,
            selectedValue: value
        });
    };

    const onFocus = () => {
        setState({
            ...state,
            showSuggestions: true
        });
    }

    let suggestionsListComponent;
    if (state.showSuggestions && state.userInput) {
        if (suggestions?.length) {
            suggestionsListComponent = (
                <div className="dropdown-content">
                    <ul className="suggestions">
                        {
                            suggestions.map((suggestion, index) => {
                                let className;

                                // Flag the active suggestion with a class
                                if (index === state.activeSuggestion) {
                                    className = "suggestion-active";
                                }
                                return (
                                    <li className={className} key={index} onClick={(el) => onClick(el, suggestion)}>
                                        {suggestion.label}
                                    </li>
                                );
                            })
                        }
                    </ul>
                </div>
            );
        }
    }

    return (
        <div className="dropdown">
            <input
                placeholder={placeholder}
                className={className}
                type="text"
                onChange={onInternalChange}
                onFocus={onFocus}
                value={value}
                ref={ref}
            />
            {suggestionsListComponent}
        </div>
    );
}

export default forwardRef(Autocomplete);