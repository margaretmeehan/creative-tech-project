import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import HorizontalTimeline from 'react-horizontal-timeline';
var _ = require('lodash');
var famous_paintings = require('./famous_paintings.json');

class ArtistInfo extends Component {
    constructor(props, context) {
        super(props, context); 
        this.state = { 
            paintingObject: this.props.paintingObject,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if (prevState.paintingObject != nextProps.paintingObject){
            return {
                paintingObject: nextProps.paintingObject,
            };
        } else {
            return null;
        }
    }

    render(){
        let painting = this.state.paintingObject;
        // let paintingDetails = _.filter(famous_paintings, function(o) { return o.url == painting.url});
        var imgStyle = {
            'maxWidth': '700px',
            'maxHeight': '600px',
          };
        return( //description
            <div>
                <h2>{painting.title}</h2>
                <p>This piece is of the style {painting.style}.</p>
                <img className="painting" src={painting.image} style={imgStyle}/>
            </div>
        )
    }
}

export default ArtistInfo