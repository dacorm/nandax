import React, {FC, useEffect, useReducer, useRef} from "react";

export interface customComponent {
    ID: string;
    forceUpdate: () => void;
}

type plainObject = {
    [key: string]: any
}

const reactionsMap: Record<string, customComponent[]> = {};
let currentlyRenderingComponent: React.FC & customComponent;

export function store(object: plainObject) {

    return new Proxy(object, {
        get: function (target, key) {
            if (typeof currentlyRenderingComponent === "undefined") {
                return target[key as keyof plainObject];
            }
            if (!reactionsMap[key as keyof typeof reactionsMap]) {
                reactionsMap[key as keyof typeof reactionsMap] = [currentlyRenderingComponent];
            }
            const hasComponent = reactionsMap[key as keyof typeof reactionsMap].find(
                comp => comp.ID === currentlyRenderingComponent.ID
            );
            if (!hasComponent) {
                reactionsMap[key as keyof typeof reactionsMap].push(currentlyRenderingComponent);
            }
            return target[key as keyof plainObject];
        },
        set: function (target, key, value) {
            reactionsMap[key as keyof typeof reactionsMap].forEach(component => component.forceUpdate());
            target[key as keyof plainObject] = value;
            return true;
        }
    })
}

export function view(MyComponent: any) {
    return function ObeservedComponent(props: any) {
        const [_, forceUpdate] = useReducer((v) => v + 1, 0);
        const component = useRef<FC | undefined>(undefined);
        component.current = MyComponent
        MyComponent.ID = `${Math.floor(Math.random() * 10e9)}`;
        MyComponent.forceUpdate = function() {
            forceUpdate();
        }

        currentlyRenderingComponent = component.current as unknown as FC & customComponent;

        useEffect(() => {
            return () => {
                component.current = undefined;
            }
        }, [])

        return <MyComponent {...props} />
    }
}