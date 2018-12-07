type StateChanged<State> = (state: State) => void

type Action<State, Args extends any[]> = (state: State, ...args: Args) => State

type RAction<Args extends any[]> = (...args: Args) => void

interface Actions<State, Args extends any[]> {
    [key: string]: Action<State, Args>
}

interface RActions<Args extends any[]> {
    [key: string]: RAction<Args>
}

type GetRActions<State, T> = {
    [K in keyof T]: T[K] extends Action<State, infer A>
    ? RAction<A>
    : never
}

interface Store<State, A extends Actions<State, any[]>> {
    getState: () => State
    actions: GetRActions<State, A>
    onChange?: StateChanged<State>
}

export const createStore = <State, A extends Actions<State, any[]>>(
    state: State,
    actions: A,
    onChange?: StateChanged<State>,
): Store<State, A> => {
    const rActions: RActions<any[]> = {}

    Object.keys(actions).forEach((key) => {
        const action = actions[key];

        if (typeof action !== 'function') {
            return
        }

        rActions[key] = (...args: any[]) => {
            const newState = action(state, ...args)

            if (newState !== state) {
                state = newState

                if (typeof store.onChange === 'function') {
                    store.onChange(state)
                }
            }
        }
    })

    const store = {
        onChange,
        actions: rActions as GetRActions<State, A>,
        getState: () => state,
    }

    // initial state change
    if (typeof onChange === 'function') {
        onChange(state)
    }

    return store
}
