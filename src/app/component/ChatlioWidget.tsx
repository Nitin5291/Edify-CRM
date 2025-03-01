import { useEffect } from 'react';
declare global {
    namespace JSX {
        interface IntrinsicElements {
            'chatlio-widget': any
        }
    }
}
const ChatlioWidget = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://js.chatlio.com/widget.js';
        script.async = true;
        script.setAttribute('strategy', 'lazyOnload');
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return <chatlio-widget widgetid="542a8523-cfc2-4ff1-5811-b6182b7fd5a1" disable-favicon-badge />;
};

export default ChatlioWidget;
