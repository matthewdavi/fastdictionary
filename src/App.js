/* @flow */
import React from 'react';
import request from 'request';
import './App.css';
import audio from './audio.svg';
const base = 'http://104.236.237.48:8080/api/';
var newWord = `hello`
function options(newWord){
  var path = base + newWord;
  return {url: path}
}
function grab(newWord, cb){ 
var whatWeWant = request(options(newWord), function(error, response, data){
  var info;
  if (!error && response.statusCode == 200){
  info = JSON.parse(data);
   //console.log('data got it');
   cb(null, info);
  }
    else{
        console.log("ERROR!!!!!");
        console.log(JSON.stringify(error));
        console.log(JSON.stringify(options));
        info = "";
    }
})
return whatWeWant;
}

class SearchBox extends React.Component{
render(){
  return <div id="searchBox">

 <input placeholder="search" onKeyDown={this.props.pressDown} onChange={this.props.newWord}/>

  </div>
}
}
class Pronunciation extends React.Component{
  constructor(props){
    super(props);
  }
  handleClick(event){
    document.querySelector(`audio.${this.props.word}`).play();
  }
  render(){
    return <div>
    <h3>Pronunciation: <img src={audio} height="25" width="25" alt="pronunciation" onClick={(event) => this.handleClick(event)} ></img>
</h3>
    <audio src={this.props.audio} className={this.props.word} ></audio>
    </div>
  }

}
class DefBox extends React.Component{
  constructor(props){
    super(props);
    console.log(this.props.audio, " audio ");
  }
render(){ 
  return <div className="defBox">
  <h1><u>{this.props.word}</u></h1>
  <h3>Definition: {this.props.def}</h3>
  <h3>"{this.props.example}"</h3>
  <Pronunciation audio={this.props.audio} word={this.props.word}/>
  </div>
}
}
class Box extends React.Component{
  constructor(props){
    super(props);
    this.state ={newestWord: '', list: []};
  }
  handlePress(event){
  if (event.key === 'Enter'){
   grab(this.state.newestWord, (err, data) => {
    console.log(data);
    var newList = this.state.list;
    newList.unshift(data);
    this.setState({list: newList});
      })
   //wait until this grab finishes
  event.target.value = "";
   
}}

newDef(event){
    this.setState({newestWord:event.target.value});
  }

  render(){
    return <div className="App">
        <SearchBox pressDown={(event) => this.handlePress(event)} newWord={(event) => this.newDef(event)}/>
        

        <section id="collection">
     {this.state.list.map((words, index) => <DefBox key={index} word={words.word} def={words.definition} audio={words.audio} example={words.example}/>)}
       </section>
      </div>
  }



}

class App extends React.Component {
  render() {
    return <Box/>;
  }
}

export default App;
