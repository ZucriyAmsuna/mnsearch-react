import React, { Component } from 'react';
import './App.css';
import carddata from './cards.json';

let sets = {
  "BS": "Base Set",
  "AW": "Awakening",
  "DE": "Dream's End",
  "ND": "Nightmare's Dawn",
  "VS": "Voice of the Storms",
  "PR": "Promos",
  "TR": "Traitor's Reach",
};

let regions = [
  "Arderial",
  "Cald",
  "Naroom",
  "Orothe",
  "Underneath",
  "Universal",
  "Core",
  "Kybar's Teeth",
  "Weave",
  "Bograth",
  "Paradwyn",
  "d'Resh",
  "Nar",
];

let cardTypes = ["Creature", "Magi", "Spell", "Relic"];
let rarities = {
  "C": "Common", 
  "U": "Uncommon", 
  "R": "Rare", 
  "P": "Promo",
};

// return true if the card is in any of the given regions
function cardInRegions(card, regions) {
  console.log(card);
  console.log(regions);
  return card.regions.filter(region => regions.includes(region)).length > 0;
}

/* props:
   ...give props that are callbacks?
   - onTextChange(event): callback for when text changes
   - onRegionChange(event)
*/
class QueryArea extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="QueryArea">
        <div className="QueryArea-search">
        Name contains: <input className="QueryArea-text" type="text" size="40"
                              onChange={this.props.onTextChange} />
        </div>
        <div className="QueryArea-panels">
          <div className="QueryArea-regions column">
            {regions.map(region =>
              <div>
                <input type="checkbox" name="region" value={region}
                       onChange={this.props.onRegionChange} />{region}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-sets column">
            {Object.keys(sets).map(set =>
              <div>
                <input type="checkbox" name="set" value={set} />{sets[set]}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-cardtypes column">
            {cardTypes.map(cardType =>
              <div>
                <input type="checkbox" name="cardtype" value={cardType} />{cardType}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-rarities column">
            {Object.keys(rarities).map(rarity =>
              <div>
                <input type="checkbox" name="rarity" value={rarity} />{rarities[rarity]}<br/>
              </div>
            )}
          </div>
          <div className="lastcolumn">&nbsp;</div>
        </div>
      </div>
    );
  }
}

/* props:
   - cards: list of JSON card data
*/
class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="SearchResults-cards">
        <thead>
          <tr>
            <td>Name</td>
            <td>Region</td>
            <td>Set</td>
            <td>Type</td>
            <td>Rarity</td>
          </tr>
        </thead>
        <tbody>
        {[].concat(this.props.cards)
         .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
         .map(card => 
           <tr key={card.key}>
             <td>{card.name || "?!?"}</td>
             <td>{card.regions.length > 1 ? 
                  card.regions[0] + "/" + card.regions[1] 
                  : card.regions[0]}
             </td>
             <td>{sets[card.set]}</td>
             <td>{card.type}</td>
             <td>{rarities[card.rarity]}</td>
           </tr>
        )}
        </tbody>
      </table>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      regions: [],
      results: [].concat(carddata),
    };

    this.onTextChange = this.onTextChange.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
  }

  onTextChange(event) {
    this.setState({ text: event.target.value.trim() }, 
                  () => this.updateSearchResults());
                  // callback is necessary to use the updated state
  }

  onRegionChange(event) {
    let panel = event.target.parentElement.parentElement;
    let coll = panel.getElementsByTagName('input');
    let arr = [...coll];
    let checkedRegions = arr.filter(inputElem => inputElem.checked)
                            .map(inputElem => inputElem.value);
    this.setState({ regions: checkedRegions }, 
                  () => this.updateSearchResults());
  }

  updateSearchResults() {
    let results = [].concat(carddata);
    if (this.state.text > '') {
      results = results.filter(card => card.name.toLowerCase().includes(this.state.text.toLowerCase()));
    };
    if (this.state.regions.length > 0) {
      results = results.filter(card => cardInRegions(card, this.state.regions));
    }
    this.setState({ results: results });
  }

  render() {
    return (
      <div className="App">
        <header>
          <img src="/magination-logo.jpg" />
        </header>
        <QueryArea onTextChange={this.onTextChange}
                   onRegionChange={this.onRegionChange} />
        <hr />
        <SearchResults cards={this.state.results} />
      </div>
    );
  }
}

export default App;
