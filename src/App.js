import React, { Component } from 'react';
import { ScrollView, Text, View, Dimensions, Image } from 'react-native';
import * as R from 'ramda';
import './App.css';

let ranks = [2, 3, 4, 5, 6, 7, 8, 9, 'jack', 'queen', 'king', 'ace'],
    suits = ['clubs', 'diamonds', 'hearts', 'spades'],
    cards = R.xprod(ranks, suits).map(([r, s]) => ({ rank: r, suit: s}))

let shuffle = () => {
  let deck = [...cards],
      i = cards.length
  
  while (i > 0) {
      let j = Math.floor(Math.random() * i)
      i--
      [deck[i], deck[j]] = [deck[j], deck[i]]
  }

  return deck
}

let displayedCount = 16,
    newDisplay = () => shuffle().slice(0, displayedCount)

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayed: newDisplay(),
      clicked: [],
      previousWasCorrect: null,
      score: 0,
      highScore: 0
    }

    this.click = this.click.bind(this)
  }

  click(card) {
    let correct = !R.includes(card, this.state.clicked),
        next = {
            previousWasCorrect: correct,
            clicked: correct ? [...this.state.clicked, card] : [],
            score: correct ? this.state.score + 1 : 0,
            displayed: newDisplay()
          }

    next.highScore = Math.max(next.score, this.state.highScore)

    this.setState(next)
  }

  render() {
    let {width, height} = Dimensions.get('window'),
        cardWidth = width/10,
        marginTotal = width - cardWidth*8,
        spacing = Math.floor(marginTotal/9)

    return (
      <View style={{width, height, backgroundColor: 'skyblue'}}>
        <View style={{width, height: height * 0.2}}>
          <Text style={{fontSize: 72, textAlign: 'center'}}>Pick A Card... Any Card...</Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
            <Text style={{fontSize: 48}}>Score: {this.state.score}</Text>
            <Text style={{fontSize: 48}}>High Score: {this.state.highScore}</Text>
          </View>
        </View>
        <ScrollView
          style={{width, height: height * 0.8, flex: 1}}
          contentContainerStyle={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', paddingLeft: spacing}}>
          {this.state.displayed.map(card =>
              <Image
              key={JSON.stringify(card)}
              source={{uri: `cards/${card.rank}_of_${card.suit}.png`}}
              style={{width: width/10, height: (width/10)*(726/500), marginRight: spacing, marginBottom: spacing}}
              onClick={() => this.click(card)}
            />)}
        </ScrollView>
      </View>
    )
  }
}

export default App;
