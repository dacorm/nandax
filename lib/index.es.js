import { jsx } from 'react/jsx-runtime';
import { useReducer, useRef, useEffect } from 'react';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var reactionsMap = {};
var currentlyRenderingComponent;
function store(object) {
    return new Proxy(object, {
        get: function (target, key) {
            if (typeof currentlyRenderingComponent === "undefined") {
                return target[key];
            }
            if (!reactionsMap[key]) {
                reactionsMap[key] = [currentlyRenderingComponent];
            }
            var hasComponent = reactionsMap[key].find(function (comp) { return comp.ID === currentlyRenderingComponent.ID; });
            if (!hasComponent) {
                reactionsMap[key].push(currentlyRenderingComponent);
            }
            return target[key];
        },
        set: function (target, key, value) {
            reactionsMap[key].forEach(function (component) { return component.forceUpdate(); });
            target[key] = value;
            return true;
        }
    });
}
function view(MyComponent) {
    return function ObeservedComponent(props) {
        var _a = useReducer(function (v) { return v + 1; }, 0); _a[0]; var forceUpdate = _a[1];
        var component = useRef(undefined);
        component.current = MyComponent;
        MyComponent.ID = "".concat(Math.floor(Math.random() * 10e9));
        MyComponent.forceUpdate = function () {
            forceUpdate();
        };
        currentlyRenderingComponent = component.current;
        useEffect(function () {
            return function () {
                component.current = undefined;
            };
        }, []);
        return jsx(MyComponent, __assign({}, props));
    };
}

export { store, view };
