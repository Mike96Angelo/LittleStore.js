# LittleStore.js
A very little store/state management library.

Only **281 bytes** minified and gzipped.

Example:
```javascript
import { createStore } from "littlestore";

interface MyAppState {
    fullName?: string
    first?: string
    last?: string

}

const makeFullName = (
    first?: string,
    last?: string
) => first && last
        ? `${first} ${last}`
        : first
            ? first
            : last

const initialState: MyAppState = {}

const store = createStore(
    // initial state
    initialState,

    // actions
    {
        changeFullName: (state, first?: string, last?: string) => {
            if (state.first === first && state.last === last) {
                return state
            } else {
                return {
                    ...state,
                    fullName: makeFullName(first, last),
                    first,
                    last,
                }
            }
        },
        changeFirstName: (state, first?: string) => {
            if (state.first === first) {
                return state
            } else {
                return {
                    ...state,
                    fullName: makeFullName(first, state.last),
                    first,
                }
            }
        },
        changeLastName: (state, last?: string) => {
            if (state.last === last) {
                return state
            } else {
                return {
                    ...state,
                    fullName: makeFullName(state.first, last),
                    last,
                }
            }
        },
    },

    // state changed handler
    (state) => console.log(`full name: ${state.fullName}`)
)

// LOGS: full name:

store.actions.changeFirstName('John')
// LOGS: full name: John

store.actions.changeFirstName('John')
// nothing is logged because the state was not changed

store.actions.changeLastName('Doe')
// LOGS: full name: John Doe

store.actions.changeFirstName(undefined)
// LOGS: full name: Doe

store.actions.changeFullName('Sam', 'Smith')
// LOGS: full name: Sam Smith
```
