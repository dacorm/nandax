import React, {useEffect, useRef, useState} from "react";
import {FC, useReducer} from "react";

interface customComponent {
    current: any;
    ID: number;
    forceUpdate: () => void;
}

type plainObject = {
    [key: string]: any
}

const reactionsMap: Record<string, customComponent[]> = {};
let currentlyRenderingComponent: React.FC & customComponent;

export function store(object: plainObject) {

    console.log(reactionsMap);
    return new Proxy(object, {
        get: function (target, key) {
            if (typeof currentlyRenderingComponent === "undefined") {
                return target[key as keyof plainObject];
            }
            if (!reactionsMap[key as keyof typeof reactionsMap]) {
                reactionsMap[key as keyof typeof reactionsMap] = [currentlyRenderingComponent];
            }
            const hasComponent = reactionsMap[key as keyof typeof reactionsMap].find(
                comp => comp.current.prototype.ID === currentlyRenderingComponent.ID
            );
            if (!hasComponent) {
                reactionsMap[key as keyof typeof reactionsMap].push(currentlyRenderingComponent);
            }
            return target[key as keyof plainObject];
        },
        set: function (target, key, value) {
            reactionsMap[key as keyof typeof reactionsMap].forEach(component => component.current.prototype.forceUpdate());
            target[key as keyof plainObject] = value;
            return true;
        }
    })
}

export function view(MyComponent: FC) {

    return function ObeservedComponent(props: any) {
        const [_, forceUpdate] = useReducer((v) => v + 1, 0);
        const component = useRef(undefined);
        MyComponent.prototype.ID = `${Math.floor(Math.random() * 10e9)}`;
        MyComponent.prototype.forceUpdate = function() {
            forceUpdate();
        }

        if (!component.current) {
            component.current = MyComponent
        }

        currentlyRenderingComponent = component as unknown as FC & customComponent;

        useEffect(() => {
            return () => {
                component.current = undefined;
            }
        }, [])

        return <MyComponent {...props} />
    }
}