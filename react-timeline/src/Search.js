import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import Timeline from './Timeline';
import ArtistInfo from './ArtistInfo';
import './index.css';

class Search extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      disabled: false,
      searchable: true,
      clearable: false,
      selectValue: '',
			rtl: false,
    };
    this.updateValue = this.updateValue.bind(this);
    this.clearValue = this.clearValue.bind(this);
  }

  clearValue (e) {
		this.select.setInputValue('');
  };

  updateValue (newValue) {
		this.setState({
			selectValue: newValue,
		})
  }

  render() {
    let hasSelected = this.state.selectValue != '' ? true : false; 

    var artists = [
      { value: 'pablo-picasso', label: 'Pablo Picasso'}, 
      { value: 'vincent-van-gogh', label: 'Vincent van Gogh'}, 
      { value: 'leonardo-da-vinci', label: 'Leonardo da Vinci'}, 
      { value: 'claude-monet', label: 'Claude Monet'}, 
      { value: 'salvador-dali', label: 'Salvador Dali'}, 
      { value: 'henri-matisse', label: 'Henri Matisse'}, 
      { value: 'rembrandt', label: 'Rembrandt'}, 
      { value: 'andy-warhol', label: 'Andy Warhol'}, 
      { value: 'georgia-o-keeffe', label: "Georgia O'Keeffe"}, 
      { value: 'michelangelo', label: 'Michelangelo'}, 
      { value: 'peter-paul-rubens', label: 'Peter Paul Rubens'}, 
      { value: 'edgar-degas', label: 'Edgar Degas'}, { value: 'caravaggio', label: 'Caravaggio'}, 
      { value: 'pierre-auguste-renoir', label: 'Pierre-Auguste Renoir'}, { value: 'raphael', label: 'Raphael'}, 
      { value: 'paul-cezanne', label: 'Paul Cezanne'}, 
      { value: 'marc-chagall', label: 'Marc Chagall'}, { value: 'titian', label: 'Titian'}, 
      { value: 'joan-miro', label: 'Joan Miro'}, { value: 'jackson-pollock', label: 'Jackson Pollock'}, 
      { value: 'gustav-klimt', label: 'Gustav Klimt'}, { value: 'albrecht-durer', label: 'Albrecht Durer'}, 
      { value: 'edward-hopper', label: 'Edward Hopper'}, { value: 'wassily-kandinsky', label: 'Wassily Kandinsky'}, { value: 'pablo-picasso', label: 'Jan Vermeer'}, { value: 'pablo-picasso', label: 'Paul Klee'}, { value: 'pablo-picasso', label: 'Edvard Munch'}, { value: 'pablo-picasso', label: 'Goya'}, 
      { value: 'janet-fish', label: 'Janet Fish'}, { value: 'edouard-manet', label: 'Edouard Manet'}
  ];
  var divStyle = {
    searchSection: {
      'width': '80%',
      'marginLeft': '20px',
    },
    searchHeading: {
      'float':'left'
    },
    searchType: {
      'float':'right'
    },
  };

    return ( 
      <div className="search-section" style={divStyle.searchSection}>
        <h3 className="search-heading" style={divStyle.searchHeading}>search an artist </h3>
        <Select
					id="state-select"
					ref={(ref) => { this.select = ref; }}
					onBlurResetsInput={false}
					onSelectResetsInput={false}
					autoFocus
					options={artists}
					simpleValue
          clearable={this.state.clearable}
					name="selected-state"
					disabled={this.state.disabled}
					value={this.state.selectValue}
					onChange={this.updateValue}
					rtl={this.state.rtl}
          searchable={this.state.searchable}
				/>
        {hasSelected && <Timeline selectedValue={this.state.selectValue}/>}
        {/* {hasSelected && <ArtistInfo/>} */}
      </div>
    );
  }
}

export default Search;