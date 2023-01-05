/// <reference types="react" />
export interface customComponent {
    ID: string;
    forceUpdate: () => void;
}
type plainObject = {
    [key: string]: any;
};
export declare function store(object: plainObject): plainObject;
export declare function view(MyComponent: any): (props: any) => JSX.Element;
export {};
