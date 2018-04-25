"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var _a = require('botbuilder'), BotFrameworkAdapter = _a.BotFrameworkAdapter, UserState = _a.UserState, ConversationState = _a.ConversationState, MemoryStorage = _a.MemoryStorage, MessageFactory = _a.MessageFactory;
var querystring = require('querystring');
var restify = require('restify');
var luis_1 = require("./luis");
var explore_1 = require("./explore");
require('es6-promise').polyfill();
require('isomorphic-fetch');
require('dotenv').load();
exports.helpMessage = MessageFactory.text("\nYou can: \n \nStart by showing artwork by saying something like 'Show me paintings by Rothko'. \n\nGet details about the piece you're looking at: 'Tell me more about this painting'. \n\nGet details about the artist: 'Tell me about Rothko' or \"Who is Rothko\".");
// getAllArtistsFromAPI();
exports.ALL_ARTISTS = explore_1.getAllArtistsFromFile();
// Create server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log(server.name + " listening to " + server.url);
});
var adapter = new BotFrameworkAdapter({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
// Add conversation state middleware
var conversationStateMiddleware = new ConversationState(new MemoryStorage());
adapter.use(conversationStateMiddleware);
var userStateMiddleware = new UserState(new MemoryStorage());
adapter.use(userStateMiddleware);
server.post('/api/messages', function (req, res) {
    // Route received request to adapter for processing
    adapter.processActivity(req, res, function (context) { return __awaiter(_this, void 0, void 0, function () {
        var convoState, userState, _a, _b, luisResults, _c, _i, _d, member;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    convoState = conversationStateMiddleware.get(context);
                    userState = userStateMiddleware.get(context);
                    _a = context.activity.type;
                    switch (_a) {
                        case 'message': return [3 /*break*/, 1];
                        case 'conversationUpdate': return [3 /*break*/, 21];
                    }
                    return [3 /*break*/, 29];
                case 1:
                    _b = userState.registered;
                    switch (_b) {
                        case true: return [3 /*break*/, 2];
                    }
                    return [3 /*break*/, 19];
                case 2: return [4 /*yield*/, luis_1.getLuisResults(context.activity.text)];
                case 3:
                    luisResults = _e.sent();
                    if (!(luisResults !== null && luisResults.topScoringIntent !== undefined)) return [3 /*break*/, 16];
                    _c = luisResults.topScoringIntent.intent;
                    switch (_c) {
                        case 'Explore_artist': return [3 /*break*/, 4];
                        case 'Explore_painting': return [3 /*break*/, 7];
                        case 'Show': return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 4:
                    if (!(luisResults.entities.length > 0)) return [3 /*break*/, 5];
                    explore_1.getArtistInfo(context, luisResults);
                    return [3 /*break*/, 15];
                case 5: return [4 /*yield*/, context.sendActivity("Sorry I didn't recognize that!")];
                case 6:
                    _e.sent();
                    _e.label = 7;
                case 7:
                    if (!(luisResults.entities.length > 0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, explore_1.getArtistInfo(context, luisResults)];
                case 8:
                    _e.sent();
                    return [3 /*break*/, 15];
                case 9: return [4 /*yield*/, context.sendActivity("Sorry I didn't recognize that!")];
                case 10:
                    _e.sent();
                    _e.label = 11;
                case 11: return [4 /*yield*/, explore_1.getArtistInfo(context, luisResults)];
                case 12:
                    _e.sent();
                    return [3 /*break*/, 15];
                case 13: return [4 /*yield*/, context.sendActivity(exports.helpMessage)];
                case 14:
                    _e.sent();
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 18];
                case 16: return [4 /*yield*/, context.sendActivity(exports.helpMessage)];
                case 17:
                    _e.sent();
                    _e.label = 18;
                case 18: return [3 /*break*/, 21];
                case 19: return [4 /*yield*/, context.sendActivity(exports.helpMessage)];
                case 20:
                    _e.sent();
                    return [3 /*break*/, 21];
                case 21:
                    if (!(context.activity.membersAdded !== undefined)) return [3 /*break*/, 28];
                    _i = 0, _d = context.activity.membersAdded;
                    _e.label = 22;
                case 22:
                    if (!(_i < _d.length)) return [3 /*break*/, 28];
                    member = _d[_i];
                    if (!(member.id !== context.activity.recipient.id)) return [3 /*break*/, 27];
                    if (!(userState.registered === undefined)) return [3 /*break*/, 25];
                    return [4 /*yield*/, context.sendActivity("Welcome to Art Bot!")];
                case 23:
                    _e.sent();
                    return [4 /*yield*/, context.sendActivity(exports.helpMessage)];
                case 24:
                    _e.sent();
                    userState.registered = true;
                    return [3 /*break*/, 27];
                case 25: return [4 /*yield*/, context.sendActivity("Welcome Back!")];
                case 26:
                    _e.sent();
                    _e.label = 27;
                case 27:
                    _i++;
                    return [3 /*break*/, 22];
                case 28: return [3 /*break*/, 29];
                case 29: return [2 /*return*/];
            }
        });
    }); });
});
