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
exports.__esModule = true;
var app_1 = require("./app");
var FuzzySet = require('fuzzyset.js');
var fs = require('fs');
var ARTISTS = ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet', 'Salvador Dali', 'Henri Matisse', 'Rembrandt',
    'Andy Warhol', "Georgia O'Keeffe", 'Michelangelo', 'Peter Paul Rubens', 'Edgar Degas', 'Caravaggio', 'Pierre-Auguste Renoir', 'Raphael', 'Paul Cezanne',
    'Marc Chagall', 'Titian', 'Joan Miro', 'Jackson Pollock', 'Gustav Klimt', 'Albrecht Durer', 'Edward Hopper', 'Wassily Kandinsky', 'Jan Vermeer', 'Paul Klee',
    'Edvard Munch', 'Goya', 'Janet Fish', 'Edouard Manet'];
var FUZZYFULLNAMES = FuzzySet(ARTISTS);
function getBestmatch(value) {
    var matches = FUZZYFULLNAMES.get(value);
    if (matches != null && matches.length > 0) {
        var bestMatch = void 0;
        var bestMatchValue = 0.0;
        for (var _i = 0, matches_1 = matches; _i < matches_1.length; _i++) {
            var match = matches_1[_i];
            if (match[0] > bestMatchValue) {
                bestMatch = match[1];
                bestMatchValue = match[0];
            }
        }
        if (bestMatchValue > .8) {
            return bestMatch;
        }
        return null;
    }
    return null;
}
exports.getBestmatch = getBestmatch;
function getAllArtistsFromFile() {
    var json_data = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
    return json_data;
}
exports.getAllArtistsFromFile = getAllArtistsFromFile;
function getAllArtistsFromAPI() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, all_artists, _i, all_artists_1, artist, url, response_1, data_1, jsonData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://www.wikiart.org/en/App/Artist/AlphabetJson?v=new&inPublicDomain=true")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    all_artists = [];
                    data.forEach(function (artist_json) {
                        var artist = {
                            wiki_artist_tag: artist_json.url,
                            wiki_artist_image: artist_json.image,
                            wiki_artist_wiki: artist_json.wikipediaUrl,
                            name: artist_json.artistName,
                            contentId: artist_json.contentId,
                            birthDayAsString: artist_json.birthDayAsString,
                            deathDayAsString: artist_json.deathDayAsString,
                            biography: artist_json.biography,
                            story: artist_json.story,
                            relatedArtistsIds: artist_json.relatedArtistsIds
                        };
                        var match = getBestmatch(artist.name);
                        if (match != null) {
                            all_artists.push(artist);
                        }
                    });
                    _i = 0, all_artists_1 = all_artists;
                    _a.label = 3;
                case 3:
                    if (!(_i < all_artists_1.length)) return [3 /*break*/, 7];
                    artist = all_artists_1[_i];
                    url = "http://www.wikiart.org/en/" + artist.wiki_artist_tag + "?json=2";
                    return [4 /*yield*/, fetch(url)];
                case 4:
                    response_1 = _a.sent();
                    return [4 /*yield*/, response_1.json()];
                case 5:
                    data_1 = _a.sent();
                    artist.biography = data_1.biography;
                    artist.story = data_1.story;
                    artist.relatedArtistsIds = data_1.relatedArtistsIds;
                    _a.label = 6;
                case 6:
                    _i++;
                    return [3 /*break*/, 3];
                case 7:
                    jsonData = JSON.stringify(all_artists);
                    fs.writeFile("FamousArtists.json", jsonData, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.getAllArtistsFromAPI = getAllArtistsFromAPI;
function getFamousPaintings() {
    return __awaiter(this, void 0, void 0, function () {
        var artists, _i, ALL_ARTISTS_1, artist;
        return __generator(this, function (_a) {
            artists = [];
            for (_i = 0, ALL_ARTISTS_1 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_1.length; _i++) {
                artist = ALL_ARTISTS_1[_i];
            }
            return [2 /*return*/];
        });
    });
}
exports.getFamousPaintings = getFamousPaintings;
function getArtistInfo(context, luis_result) {
    if (luis_result.entities.length && luis_result.entities[0].type == 'Artist') {
        var name_1 = luis_result.entities[0].entity;
        console.log(name_1);
        if (name_1 != null) {
            for (var _i = 0, ALL_ARTISTS_2 = app_1.ALL_ARTISTS; _i < ALL_ARTISTS_2.length; _i++) {
                var artist = ALL_ARTISTS_2[_i];
                console.log(artist.name + " = " + artist.name.search(new RegExp(name_1, 'i')));
                if (artist.name.search(new RegExp(name_1, 'i')) != -1) {
                    context.sendActivity(artist.biography);
                }
            }
        }
    }
    else {
        context.sendActivity(app_1.helpMessage);
    }
}
exports.getArtistInfo = getArtistInfo;
