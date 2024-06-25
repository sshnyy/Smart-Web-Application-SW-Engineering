import { configureStore } from '@reduxjs/toolkit';

const initialState = { value: 0 };

function counterReducer(state = initialState, action: any) {
    // Check to see if the reducer cares about this action
    if (action.type === 'counter/increment') {
        // If so, make a copy of `state`
        return {
            ...state,
            // and update the copy with the new value
            value: state.value + 1
        };
    }
    // otherwise return the existing state unchanged
    return state;
}

const store = configureStore(
    { reducer: counterReducer }
);

console.log(store.getState());
// {value: 0}

store.dispatch(
    { type: 'counter/increment' }
);

console.log(store.getState());
// {value: 1}

const increment = () => {
    return {
        type: 'counter/increment'
    };
};

store.dispatch(increment());

console.log(store.getState());
// {value: 2}

const selectCounterValue = (state: any) => state.value;

const currentValue = selectCounterValue(store.getState());
console.log(currentValue);
// 2