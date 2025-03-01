// typings/jsx.d.ts

import 'react';

declare module 'react' {
    interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
        // add your custom element here
        'chatlio-widget'?: any;
    }
}
