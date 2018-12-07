import { createStore } from "./LittleStore";

// setup

const initialState = { test: true }

type State = typeof initialState

const actions = {
    setTest: (state: State, test: boolean) => state.test === test
        ? state
        : {
            ...state,
            test
        }
}

const onChange = jest.fn(() => { })

const store = createStore(
    initialState,
    actions,
    onChange
)

// run tests

it('Calls the onChange handler when state is changed.', () => {
    const state = store.getState()
    store.actions.setTest(!state.test)
    const newState = store.getState()

    expect(onChange).toBeCalledWith(newState)
    expect(newState).not.toEqual(state)
})

it('Does NOT call the onChange handler when state is NOT changed.', () => {
    const state = store.getState()
    store.actions.setTest(state.test)
    const newState = store.getState()

    expect(onChange).not.toBeCalled()
    expect(newState).toEqual(state)
})
