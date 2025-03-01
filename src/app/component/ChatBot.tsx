import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ChatBot: React.FC = () => {
    const pathname = usePathname()

    useEffect(() => {
        // Function to add the Chatwoot SDK script dynamically
        const BASE_PATH = 'https://chatwoot.digitallync.ai'
        const addChatwootScript = () => {
            const script = document.createElement("script");
            script.src = `${BASE_PATH}/packs/js/sdk.js`;
            script.defer = true;
            script.async = true;
            script.onload = function () {
                (window as any).chatwootSDK.run({
                    websiteToken: "sNUij4RrWzt9ieQfnupWAdJz",
                    baseUrl: BASE_PATH,
                });
            };
            document.body.appendChild(script);
        };

        // Add the Chatwoot SDK script when the component mounts
        addChatwootScript();

        // Cleanup function to remove the script when the component unmounts
        return () => {
            const existingScript = document.querySelector(
                'script[src^="' + BASE_PATH + '/packs/js/sdk.js"]'
            );
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [pathname]);

    return null; // ChatBot doesn't render any DOM elements
};

export default ChatBot;
