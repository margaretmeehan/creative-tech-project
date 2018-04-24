import {ALL_ARTISTS, MyConversationState, MyUserState, helpMessage} from './app';
import {StateContext} from 'botbuilder-botbldr';
import {LuisResult, getEntityOfType} from './luis';
const traverson = require('traverson');
const JsonHalAdapter = require('traverson-hal');
const FuzzySet = require('fuzzyset.js');
var fs = require('fs');

const ARTISTS: string[] = ['Pablo Picasso', 'Vincent van Gogh', 'Leonardo da Vinci', 'Claude Monet', 'Salvador Dali', 'Henri Matisse', 'Rembrandt',
          'Andy Warhol', "Georgia O'Keeffe", 'Michelangelo', 'Peter Paul Rubens', 'Edgar Degas', 'Caravaggio', 'Pierre-Auguste Renoir', 'Raphael', 'Paul Cezanne', 
          'Marc Chagall', 'Titian', 'Joan Miro', 'Jackson Pollock', 'Gustav Klimt', 'Albrecht Durer', 'Edward Hopper', 'Wassily Kandinsky', 'Jan Vermeer', 'Paul Klee', 
          'Edvard Munch', 'Goya', 'Janet Fish', 'Edouard Manet'];
const FUZZYFULLNAMES = FuzzySet(ARTISTS);


export interface Artist {
  wiki_artist_tag: string,
  wiki_artist_image: string,
  wiki_artist_wiki: string,
  name: string,
  contentId: number,
  birthDayAsString: string,
  deathDayAsString: string,
  biography: string,
  story: string,
  relatedArtistsIds: number[]
}


export interface Artwork {
  id: string,
  slug: string,
  created_at: string,
  updated_at: string,
  title: string,
  category: string,
  medium: string,
  date: string,
  dimensions: {
    in: {
      text: string,
      height: number,
      width: number,
      depth: number,
      diameter: number
    },
    cm: {
      text: string,
      height: number,
      width: number,
      depth: number,
      diameter: number
    }
  },
  exhibition_history: string,
  collecting_institution: string,
  image_rights: string,
  image_versions: string[]
}


export function getBestmatch(value: string, ) : string {
  let matches: [number, string][] = FUZZYFULLNAMES.get(value);
  if(matches != null && matches.length > 0) {
      let bestMatch: string;
      let bestMatchValue: number = 0.0;
      for(let match of matches) {
          if (match[0] > bestMatchValue) {
              bestMatch = match[1];
              bestMatchValue = match[0];
          }
      }
      if(bestMatchValue > .8){
        return bestMatch;
      } 
      return null;
  } 
  return null;
}


export function getAllArtistsFromFile(){
  let json_data: Artist[] = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
  return json_data;
}


export async function getAllArtistsFromAPI(){
  let response = await fetch("https://www.wikiart.org/en/App/Artist/AlphabetJson?v=new&inPublicDomain=true");
  let data = await response.json();
  let all_artists: Artist[] = [];
  data.forEach(artist_json => {
    let artist: Artist = {
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
    }
    let match = getBestmatch(artist.name);
    if(match != null){
      all_artists.push(artist);
    }
  });

  for(let artist of all_artists) {
    let url = "http://www.wikiart.org/en/" + artist.wiki_artist_tag + "?json=2";
    let response = await fetch(url);
    let data = await response.json();
    artist.biography = data.biography;
    artist.story = data.story;
    artist.relatedArtistsIds = data.relatedArtistsIds;
  }

  let jsonData = JSON.stringify(all_artists);
  fs.writeFile("FamousArtists.json", jsonData, function(err) {
    if (err) {
        console.log(err);
    }
  });
}


export function getArtistInfo(context: StateContext<MyConversationState, MyUserState>, luis_result: LuisResult) {
  if(luis_result.entities.length && luis_result.entities[0].type == 'Artist'){
    let name = luis_result.entities[0].entity;
    console.log(name);
    if(name != null) {
      for(let artist of ALL_ARTISTS) {
        console.log(artist.name + " = " + artist.name.search(new RegExp(name, 'i')));
        if(artist.name.search(new RegExp(name, 'i')) != -1) {
          context.sendActivity(artist.biography);
        }
      }
    }
  } else {
    context.sendActivity(helpMessage);
  }
}