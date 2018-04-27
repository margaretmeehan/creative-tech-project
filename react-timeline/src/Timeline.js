import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import HorizontalTimeline from 'react-horizontal-timeline';
import PaintingInfo from './PaintingInfo'; // Import a component from another file
import { ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

var _ = require('lodash');
var famous_artists = require('./famous_artists.json'); //(with path)

class Timeline extends Component {
    constructor(props, context) {
        super(props, context); 
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.state = { 
            value: 0, 
            previous: 0,
            selectedArtist: this.props.selectedValue,
            artistObject: null,
            toggleValue: 1
        };
    }

    handleToggleChange(e) {
        this.setState({ toggleValue: e });
      }

    static getDerivedStateFromProps(nextProps, prevState){
        if (prevState.artistObject == null){
            let artist = _.filter(famous_artists, function(o) { return o.url == nextProps.selectedValue});
            return {
                artistObject: artist
            }
        }

        if (prevState.selectedArtist != nextProps.selectedValue){
            let artist = _.filter(famous_artists, function(o) { return o.url == nextProps.selectedValue});
            return {
                selectedArtist: nextProps.selectedValue,
                artistObject: artist
            };
        } else {
            return null;
        }
    }

    render(){
        let artistInformation = this.state.artistObject[0];
        let rangePaintings = artistInformation.rangePaintings;
        const paintingDateRange = _.map(rangePaintings, function (o) { return o.yearAsString});
        let cleanedRange = _.compact(paintingDateRange);
        // console.log(this.state.toggleValue);
        let popularPaintings = artistInformation.popularPaintings;
        const popularPaintingDateRange = _.map(popularPaintings, function (o) { return o.yearAsString});
        let cleanedPopular = _.compact(popularPaintingDateRange);
        
        let isRangeTimeline = this.state.toggleValue == 1 ? true : false; 
        return(
            <div>
                <h2>{artistInformation.artistName}</h2>
                <ButtonToolbar >
                    <ToggleButtonGroup type="radio" name="options" 
                            defaultValue={1} 
                            //value={this.state.value}
                            onChange={this.handleToggleChange}>
                        <ToggleButton value={1}> See Samples from Oeuvre</ToggleButton>
                        <ToggleButton value={2}> See Popular Artworks </ToggleButton>
                    </ToggleButtonGroup>
                </ButtonToolbar>
                {/* Bounding box for the Timeline */}
                <div style={{ width: '80%', height: '120px', margin: '0 auto' }}>
                
                {isRangeTimeline && <HorizontalTimeline
                    index={this.state.value}
                    indexClick={(index) => {
                        this.setState({ 
                            value: index, 
                            previous: this.state.value 
                        });
                    }}
                    getLabel={(label) => { return label; }}
                    values={ cleanedRange } />}
                
                {!isRangeTimeline && <HorizontalTimeline
                    index={this.state.value}
                    indexClick={(index) => {
                        this.setState({ 
                            value: index, 
                            previous: this.state.value 
                        });
                    }}
                    getLabel={(label) => { return label; }}
                    values={ cleanedPopular } />}
                </div>
                <div className='text-center'>
                    {isRangeTimeline && <PaintingInfo paintingObject={rangePaintings[this.state.value]} timelineType={this.state.toggleValue}/>}
                    {!isRangeTimeline && <PaintingInfo paintingObject={popularPaintings[this.state.value]} timelineType={this.state.toggleValue}/>}
                </div>
            </div>
        )
    }
}

export default Timeline