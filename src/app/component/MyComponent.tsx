import React from "react";
import "@copilotkit/react-textarea/styles.css";
import { CopilotTextarea } from "@copilotkit/react-textarea";
import { CopilotKit, useCopilotReadable } from "@copilotkit/react-core";

// Define the type for your external context
type CopilotContext = {
  description: string;
  value: string; // or the appropriate type for 'relevantInformation'
};

const MyComponent: React.FC = () => {
  // Call anywhere in your app to provide external context
  // Make sure you wrap the app with <CopilotKit>
  useCopilotReadable({
    description: "The description of your data",
    value: "relevantInformation", // Replace with actual data variable
  });

  const yourConfigObject = {
    // Add the necessary properties as per the AutosuggestionsConfigUserSpecified type
    triggerCharacters: ["@", "#"], // Characters that trigger suggestions
    suggestionType: "inline", // The type of suggestions (e.g., 'inline', 'block')
    maxSuggestions: 5, // Maximum number of suggestions to display
    // ...other required properties
  };

  return (
    <CopilotKit url="/api/copilotkit/chat">
      <CopilotTextarea
        placeholder="Start typing..."
        autosuggestionsConfig={yourConfigObject as any}
        // Other props you may need
      />
    </CopilotKit>
  );
};

export default MyComponent;
