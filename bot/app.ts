const { MemoryStorage, MessageFactory } = require('botbuilder');
const superagent = require('superagent');
const traverson = require('traverson');
const JsonHalAdapter = require('traverson-hal');
const querystring = require('querystring');


import {ServiceBot} from 'botbuilder-botbldr';
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

export interface MyConversationState {
    temp_api_token: string;
}

export interface MyUserState {
    registered: boolean;
}

// getAllArtistsFromAPI();
export const ALL_ARTISTS: Artist[] = getAllArtistsFromFile();

async function get_temp_key(convoState: MyConversationState) {
    var queryParams = {
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
    }
    let artApiRequest = process.env.API_URL + '?' + querystring.stringify(queryParams);
    const response = await fetch(artApiRequest, {method: 'post'});
    const data = await response.json();
    convoState.temp_api_token = data.token;
}

const bot = new ServiceBot<MyConversationState, MyUserState>();

bot.onRequest(async context => {
    const convoState = context.conversationState;
    const userState = context.userState;
    switch (context.request.type) {
        case 'message' :
            switch (userState.registered){
                case true:
                    const luisResults: LuisResult = await getLuisResults(context.request.text);
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
            if (context.request.membersAdded !== undefined){
                for (const member of context.request.membersAdded) {
                    if (member.id !== context.request.recipient.id){
                        await get_temp_key(convoState);
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