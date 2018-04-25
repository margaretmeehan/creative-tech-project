import {TurnContext} from 'botbuilder-core/lib';
const { BotFrameworkAdapter, UserState, ConversationState, MemoryStorage, MessageFactory} = require('botbuilder');
const querystring = require('querystring');
const restify = require('restify');

import {getLuisResults, LuisResult} from './luis';
import {getArtistInfo, Artist, getAllArtistsFromFile, getAllArtistsFromAPI} from './explore';

require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').load();

export const helpMessage = MessageFactory.text(`
You can: \n 
Start by showing artwork by saying something like 'Show me paintings by Rothko'. \n
Get details about the piece you're looking at: 'Tell me more about this painting'. \n
Get details about the artist: 'Tell me about Rothko' or "Who is Rothko".`);


// getAllArtistsFromAPI();
export const ALL_ARTISTS: Artist[] = getAllArtistsFromFile();

// Create server
let server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(`${server.name} listening to ${server.url}`);
});

const adapter = new BotFrameworkAdapter({ 
    appId: process.env.MICROSOFT_APP_ID, 
    appPassword: process.env.MICROSOFT_APP_PASSWORD 
});

export interface MyConversationState {
    temp_api_token: string;
}

export interface MyUserState {
    registered: boolean;
}

export interface MyContext extends TurnContext {
    // Added by UserState middleware.
    readonly userState: MyUserState;

    // Added by ConversationState middleware.
    readonly conversationState: MyConversationState;
}

// Add conversation state middleware
const conversationStateMiddleware = new ConversationState(new MemoryStorage()); 
adapter.use(conversationStateMiddleware);

const userStateMiddleware = new UserState(new MemoryStorage());
adapter.use(userStateMiddleware);

server.post('/api/messages', (req, res) => {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, async (context: MyContext) => {
        const convoState = conversationStateMiddleware.get(context);
        const userState = userStateMiddleware.get(context);
        switch (context.activity.type) {
            case 'message' :
                switch (userState.registered){
                    case true:
                        const luisResults: LuisResult = await getLuisResults(context.activity.text);
                        if (luisResults !== null && luisResults.topScoringIntent !== undefined) {
                            switch (luisResults.topScoringIntent.intent) {
                                case 'Explore_artist':
                                    if (luisResults.entities.length > 0){
                                        getArtistInfo(context, luisResults);
                                        break;
                                    } else {
                                        await context.sendActivity("Sorry I didn't recognize that!");
                                    }
                                case 'Explore_painting':
                                    if (luisResults.entities.length > 0){
                                        await getArtistInfo(context, luisResults);
                                        break;
                                    } else {
                                        await context.sendActivity("Sorry I didn't recognize that!");
                                    }
                                case 'Show':
                                    await getArtistInfo(context, luisResults);
                                    break;
                                default:
                                    await context.sendActivity(helpMessage);
                                break;
                            }
                        } else {
                            await context.sendActivity(helpMessage);
                        }
                        break;
                    default:
                        await context.sendActivity(helpMessage);
                        break;    
                }
            case 'conversationUpdate':
                if (context.activity.membersAdded !== undefined){
                    for (const member of context.activity.membersAdded) {
                        if (member.id !== context.activity.recipient.id){
                            if(userState.registered === undefined){
                                await context.sendActivity("Welcome to Art Bot!");
                                await context.sendActivity(helpMessage);
                                userState.registered = true;
                            } else {
                                await context.sendActivity("Welcome Back!");
                            }
                        }
                    }
                }
                break;   
        }
    });
});