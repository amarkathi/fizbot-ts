/**
 * Copyright 2018 IBM All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/// <reference types="node" />
import { RequestResponse } from 'request';
/**
 * The IBM Watson&trade; Assistant service combines machine learning, natural language understanding, and integrated dialog tools to create conversation flows between your apps and your users.
 */
declare class AssistantV2  {
    static URL: string;
    name: string;
    serviceVersion: string;
    /**
     * Construct a AssistantV2 object.
     *
     * @param {Object} options - Options for the service.
     * @param {string} options.version - The API version date to use with the service, in "YYYY-MM-DD" format. Whenever the API is changed in a backwards incompatible way, a new minor version of the API is released. The service uses the API version for the date you specify, or the most recent version before that date. Note that you should not programmatically specify the current date at runtime, in case the API has been updated since your application's release. Instead, specify a version date that is compatible with your application, and don't change it until your application is ready for a later version.
     * @param {string} [options.url] - The base url to use when contacting the service (e.g. 'https://gateway.watsonplatform.net/assistant/api'). The base url may differ between Bluemix regions.
     * @param {string} [options.username] - The username used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
     * @param {string} [options.password] - The password used to authenticate with the service. Username and password credentials are only required to run your application locally or outside of Bluemix. When running on Bluemix, the credentials will be automatically loaded from the `VCAP_SERVICES` environment variable.
     * @param {string} [options.iam_access_token] - An IAM access token fully managed by the application. Responsibility falls on the application to refresh the token, either before it expires or reactively upon receiving a 401 from the service, as any requests made with an expired token will fail.
     * @param {string} [options.iam_apikey] - An API key that can be used to request IAM tokens. If this API key is provided, the SDK will manage the token and handle the refreshing.
     * @param {string} [options.iam_url] - An optional URL for the IAM service API. Defaults to 'https://iam.bluemix.net/identity/token'.
     * @param {boolean} [options.use_unauthenticated] - Set to `true` to avoid including an authorization header. This option may be useful for requests that are proxied.
     * @param {Object} [options.headers] - Default headers that shall be included with every request to the service.
     * @param {boolean} [options.headers.X-Watson-Learning-Opt-Out] - Set to `true` to opt-out of data collection. By default, all IBM Watson services log requests and their results. Logging is done only to improve the services for future users. The logged data is not shared or made public. If you are concerned with protecting the privacy of users' personal information or otherwise do not want your requests to be logged, you can opt out of logging.
     * @constructor
     * @returns {AssistantV2}
     * @throws {Error}
     */
    constructor(options: AssistantV2.Options);
    /*************************
     * sessions
     ************************/
    /**
     * Create a session.
     *
     * Create a new session. A session is used to send user input to a skill and receive responses. It also maintains the
     * state of the conversation.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.assistant_id - Unique identifier of the assistant. You can find the assistant ID of an
     * assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see
     * the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants).
     *
     * **Note:** Currently, the v2 API does not support creating assistants.
     * @param {Object} [params.headers] - Custom request headers
     * @param {Function} [callback] - The callback that handles the response.
     * @returns {NodeJS.ReadableStream|void}
     */
    createSession(params: AssistantV2.CreateSessionParams, callback?: AssistantV2.Callback<AssistantV2.SessionResponse>): NodeJS.ReadableStream | void;
    /**
     * Delete session.
     *
     * Deletes a session explicitly before it times out.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.assistant_id - Unique identifier of the assistant. You can find the assistant ID of an
     * assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see
     * the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants).
     *
     * **Note:** Currently, the v2 API does not support creating assistants.
     * @param {string} params.session_id - Unique identifier of the session.
     * @param {Object} [params.headers] - Custom request headers
     * @param {Function} [callback] - The callback that handles the response.
     * @returns {NodeJS.ReadableStream|void}
     */
    deleteSession(params: AssistantV2.DeleteSessionParams, callback?: AssistantV2.Callback<AssistantV2.Empty>): NodeJS.ReadableStream | void;
    /*************************
     * message
     ************************/
    /**
     * Send user input to assistant.
     *
     * Send user input to an assistant and receive a response.
     *
     * There is no rate limit for this operation.
     *
     * @param {Object} params - The parameters to send to the service.
     * @param {string} params.assistant_id - Unique identifier of the assistant. You can find the assistant ID of an
     * assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see
     * the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants).
     *
     * **Note:** Currently, the v2 API does not support creating assistants.
     * @param {string} params.session_id - Unique identifier of the session.
     * @param {MessageInput} [params.input] - An input object that includes the input text.
     * @param {MessageContext} [params.context] - State information for the conversation.
     * @param {Object} [params.headers] - Custom request headers
     * @param {Function} [callback] - The callback that handles the response.
     * @returns {NodeJS.ReadableStream|void}
     */
    message(params: AssistantV2.MessageParams, callback?: AssistantV2.Callback<AssistantV2.MessageResponse>): NodeJS.ReadableStream | void;
}
/*************************
 * interfaces
 ************************/
declare namespace AssistantV2 {
    /** Options for the `AssistantV2` constructor. */
    type Options = {
        version: string;
        url?: string;
        iam_access_token?: string;
        iam_apikey?: string;
        iam_url?: string;
        username?: string;
        password?: string;
        use_unauthenticated?: boolean;
        headers?: object;
    };
    /** The callback for a service request. */
    type Callback<T> = (error: any, body?: T, response?: RequestResponse) => void;
    /** The body of a service request that returns no response data. */
    interface Empty {
    }
    /*************************
     * request interfaces
     ************************/
    /** Parameters for the `createSession` operation. */
    interface CreateSessionParams {
        /** Unique identifier of the assistant. You can find the assistant ID of an assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants). **Note:** Currently, the v2 API does not support creating assistants. */
        assistant_id: string;
        headers?: Object;
    }
    /** Parameters for the `deleteSession` operation. */
    interface DeleteSessionParams {
        /** Unique identifier of the assistant. You can find the assistant ID of an assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants). **Note:** Currently, the v2 API does not support creating assistants. */
        assistant_id: string;
        /** Unique identifier of the session. */
        session_id: string;
        headers?: Object;
    }
    /** Parameters for the `message` operation. */
    interface MessageParams {
        /** Unique identifier of the assistant. You can find the assistant ID of an assistant on the **Assistants** tab of the Watson Assistant tool. For information about creating assistants, see the [documentation](https://console.bluemix.net/docs/services/assistant/create-assistant.html#creating-assistants). **Note:** Currently, the v2 API does not support creating assistants. */
        assistant_id: string;
        /** Unique identifier of the session. */
        session_id: string;
        /** An input object that includes the input text. */
        input?: MessageInput;
        /** State information for the conversation. */
        context?: MessageContext;
        headers?: Object;
    }
    /*************************
     * model interfaces
     ************************/
    /** CaptureGroup. */
    interface CaptureGroup {
        /** A recognized capture group for the entity. */
        group: string;
        /** Zero-based character offsets that indicate where the entity value begins and ends in the input text. */
        location?: number[];
    }
    /** Dialog log message details. */
    interface DialogLogMessage {
        /** The severity of the log message. */
        level: string;
        /** The text of the log message. */
        message: string;
    }
    /** DialogNodeAction. */
    interface DialogNodeAction {
        /** The name of the action. */
        name: string;
        /** The type of action to invoke. */
        action_type?: string;
        /** A map of key/value pairs to be provided to the action. */
        parameters?: Object;
        /** The location in the dialog context where the result of the action is stored. */
        result_variable: string;
        /** The name of the context variable that the client application will use to pass in credentials for the action. */
        credentials?: string;
    }
    /** DialogNodeOutputOptionsElement. */
    interface DialogNodeOutputOptionsElement {
        /** The user-facing label for the option. */
        label: string;
        /** An object defining the message input to be sent to the assistant if the user selects the corresponding option. */
        value: DialogNodeOutputOptionsElementValue;
    }
    /** An object defining the message input to be sent to the assistant if the user selects the corresponding option. */
    interface DialogNodeOutputOptionsElementValue {
        /** The user input. */
        input?: MessageInput;
    }
    /** DialogNodesVisited. */
    interface DialogNodesVisited {
        /** A dialog node that was triggered during processing of the input message. */
        dialog_node?: string;
        /** The title of the dialog node. */
        title?: string;
        /** The conditions that trigger the dialog node. */
        conditions?: string;
    }
    /** DialogRuntimeResponseGeneric. */
    interface DialogRuntimeResponseGeneric {
        /** The type of response returned by the dialog node. The specified response type must be supported by the client application or channel. **Note:** The **suggestion** response type is part of the disambiguation feature, which is only available for Premium users. */
        response_type: string;
        /** The text of the response. */
        text?: string;
        /** How long to pause, in milliseconds. */
        time?: number;
        /** Whether to send a "user is typing" event during the pause. */
        typing?: boolean;
        /** The URL of the image. */
        source?: string;
        /** The title to show before the response. */
        title?: string;
        /** The description to show with the the response. */
        description?: string;
        /** The preferred type of control to display. */
        preference?: string;
        /** An array of objects describing the options from which the user can choose. */
        options?: DialogNodeOutputOptionsElement[];
        /** A message to be sent to the human agent who will be taking over the conversation. */
        message_to_human_agent?: string;
        /** A label identifying the topic of the conversation, derived from the **user_label** property of the relevant node. */
        topic?: string;
        /** An array of objects describing the possible matching dialog nodes from which the user can choose. **Note:** The **suggestions** property is part of the disambiguation feature, which is only available for Premium users. */
        suggestions?: DialogSuggestion[];
    }
    /** DialogSuggestion. */
    interface DialogSuggestion {
        /** The user-facing label for the disambiguation option. This label is taken from the **user_label** property of the corresponding dialog node. */
        label: string;
        /** An object defining the message input to be sent to the assistant if the user selects the corresponding disambiguation option. */
        value: DialogSuggestionValue;
        /** The dialog output that will be returned from the Watson Assistant service if the user selects the corresponding option. */
        output?: Object;
    }
    /** An object defining the message input to be sent to the assistant if the user selects the corresponding disambiguation option. */
    interface DialogSuggestionValue {
        /** The user input. */
        input?: MessageInput;
    }
    /** State information for the conversation. */
    interface MessageContext {
        /** Contains information that can be shared by all skills within the Assistant. */
        global?: MessageContextGlobal;
        /** Contains information specific to particular skills within the Assistant. */
        skills?: MessageContextSkills;
    }
    /** Contains information that can be shared by all skills within the Assistant. */
    interface MessageContextGlobal {
        /** Properties interpreted by the Assistant that are shared across all skills within the Assistant. */
        system?: MessageContextGlobalSystem;
    }
    /** Properties that are shared by all skills used by the assistant. */
    interface MessageContextGlobalSystem {
        /** The user time zone. The assistant uses the time zone to correctly resolve relative time references. */
        timezone?: string;
        /** String value provided by the API client that should be unique per each distinct end user of the service powered by Assistant. */
        user_id?: string;
        /** This property is normally set by the Assistant which sets this to 1 during the first conversation turn and then increments it by 1 with every subsequent turn. A turn count equal to 0 (or > 0) informs the Assistant that this is (or is not) the first turn in a conversation which influences the behavior of some skills. The Conversation skill uses this to evaluate its `welcome` and `conversation_start` conditions. */
        turn_count?: number;
    }
    /** Contains information specific to particular skills within the Assistant. */
    interface MessageContextSkills {
        /** MessageContextSkills accepts additional properties. */
        [propName: string]: any;
    }
    /** The user input. */
    interface MessageInput {
        /** The type of user input. Currently, only text input is supported. */
        message_type?: string;
        /** The text of the user input. This string cannot contain carriage return, newline, or tab characters, and it must be no longer than 2048 characters. */
        text?: string;
        /** Properties that control how the assistant responds. */
        options?: MessageInputOptions;
        /** Intents to use when evaluating the user input. Include intents from the previous response to continue using those intents rather than trying to recognize intents in the new input. */
        intents?: RuntimeIntent[];
        /** Entities to use when evaluating the message. Include entities from the previous response to continue using those entities rather than detecting entities in the new input. */
        entities?: RuntimeEntity[];
        /** For internal use only. */
        suggestion_id?: string;
    }
    /** Optional properties that control how the assistant responds. */
    interface MessageInputOptions {
        /** Whether to return additional diagnostic information. Set to `true` to return additional information under the `output.debug` key. */
        debug?: boolean;
        /** Whether to start a new conversation with this user input. Specify `true` to clear the state information stored by the session. */
        restart?: boolean;
        /** Whether to return more than one intent. Set to `true` to return all matching intents. */
        alternate_intents?: boolean;
        /** Whether to return session context with the response. If you specify `true`, the response will include the `context` property. */
        return_context?: boolean;
    }
    /** Assistant output to be rendered or processed by the client. */
    interface MessageOutput {
        /** Output intended for any channel. It is the responsibility of the client application to implement the supported response types. */
        generic?: DialogRuntimeResponseGeneric[];
        /** An array of intents recognized in the user input, sorted in descending order of confidence. */
        intents?: RuntimeIntent[];
        /** An array of entities identified in the user input. */
        entities?: RuntimeEntity[];
        /** An array of objects describing any actions requested by the dialog node. */
        actions?: DialogNodeAction[];
        /** Additional detailed information about a message response and how it was generated. */
        debug?: MessageOutputDebug;
    }
    /** Additional detailed information about a message response and how it was generated. */
    interface MessageOutputDebug {
        /** An array of objects containing detailed diagnostic information about the nodes that were triggered during processing of the input message. */
        nodes_visited?: DialogNodesVisited[];
        /** An array of up to 50 messages logged with the request. */
        log_messages?: DialogLogMessage[];
        /** Assistant sets this to true when this message response concludes or interrupts a dialog. */
        branch_exited?: boolean;
        /** When `branch_exited` is set to `true` by the Assistant, the `branch_exited_reason` specifies whether the dialog completed by itself or got interrupted. */
        branch_exited_reason?: string;
    }
    /** A response from the Watson Assistant service. */
    interface MessageResponse {
        /** Assistant output to be rendered or processed by the client. */
        output: MessageOutput;
        /** The current session context. Included in the response if the `return_context` property of the message input was set to `true`. */
        context?: MessageContext;
    }
    /** A term from the request that was identified as an entity. */
    interface RuntimeEntity {
        /** An entity detected in the input. */
        entity: string;
        /** An array of zero-based character offsets that indicate where the detected entity values begin and end in the input text. */
        location: number[];
        /** The term in the input text that was recognized as an entity value. */
        value: string;
        /** A decimal percentage that represents Watson's confidence in the entity. */
        confidence?: number;
        /** Any metadata for the entity. */
        metadata?: Object;
        /** The recognized capture groups for the entity, as defined by the entity pattern. */
        groups?: CaptureGroup[];
    }
    /** An intent identified in the user input. */
    interface RuntimeIntent {
        /** The name of the recognized intent. */
        intent: string;
        /** A decimal percentage that represents Watson's confidence in the intent. */
        confidence: number;
    }
    /** SessionResponse. */
    interface SessionResponse {
        /** The session ID. */
        session_id: string;
    }
}
export = AssistantV2;
