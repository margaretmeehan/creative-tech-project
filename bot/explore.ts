import { MyConversationState, MyUserState } from './app';
import { StateContext } from 'botbuilder-botbldr';
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
  wiki_url: string,
  wiki_artist_image: string,
  wiki_artist_wiki: string,
  name: string
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

export function getAllArtists(){
  let json_data: Artist[] = JSON.parse(fs.readFileSync('FamousArtists.json', 'utf8'));
  return json_data;
  // const response = await fetch("https://www.wikiart.org/en/App/Artist/AlphabetJson?v=new&inPublicDomain=true");
  // const data = await response.json();
  // data.forEach(artist_json => {
  //   let artist: Artist = {
  //     wiki_url: artist_json.url,
  //     wiki_artist_image: artist_json.image,
  //     wiki_artist_wiki: artist_json.wikipediaUrl,
  //     name: artist_json.artistName
  //   }
  //   let match = getBestmatch(artist.name);
  //   if(match != null){
  //     all_artists.push(artist);
  //   }
  // });

  // var jsonData = JSON.stringify(all_artists);
  // fs.writeFile("FamousArtists.json", jsonData, function(err) {
  //   if (err) {
  //       console.log(err);
  //   }
  // });
}


export async function getArtistInfo(convoState: MyConversationState, luis_result: LuisResult): Promise<Artist> {
  if(luis_result.entities.length && luis_result.entities[0].type == 'Artist'){
    let artist_name = luis_result.entities[0].entity;
    traverson.registerMediaType(JsonHalAdapter.mediaType, JsonHalAdapter);
    let api = traverson.from('https://api.artsy.net/api').jsonHal();
    api.newRequest()
      .follow('artists')
      .withRequestOptions({
        headers: {
          'X-Xapp-Token': convoState.temp_api_token,
          'Accept': 'application/vnd.artsy-v2+json'
        }
      })
      .withTemplateParameters({ artworks: true, size:1, term: artist_name })
      .getResource(function(error, artistResponse) {
        if(artistResponse._embedded.artists.length){
          return <Artist>artistResponse._embedded.artists[0]; 
        }
      });
  }
  return null;
  
  
}