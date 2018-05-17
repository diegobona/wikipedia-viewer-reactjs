import React, { Component } from 'react';
import ResultsList from './results-list';
import axios from 'axios';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchInput: '',
      searchResults: [],
      errorMessage: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({
      searchInput: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    document.querySelector('.spinner').style.display = 'block';
    axios.get(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${this.state.searchInput}&origin=*&format=json`)
    .then((wikiData) => {
      this.setState({ searchResults: wikiData.data.query.search });
      document.querySelector('.spinner').style.display = 'none';

      if (this.state.searchResults.length === 0) {
        this.setState({
          errorMessage: ` Unable to find results for \"${this.state.searchInput}\". Consider revising your search.`
        });
        document.querySelector('.error-message').style.display = 'block';
      }
      else {
        document.querySelector('.error-message').style.display = 'none';
      }
    }).catch((error) => {
      this.setState({ errorMessage: ' Unable to load Wikipedia search results.' });
      document.querySelector('.spinner').style.display = 'none';
      document.querySelector('.error-message').style.display = 'block';
    });
  }

  render() {
    return (
      <div className="body">
        <header>
          <h1>Wikipedia Viewer</h1>
        </header>
        <main>
          <div className="fab fa-wikipedia-w fa-4x"></div>
          <form role="search" onSubmit={(event) => this.handleSubmit(event)}>
            <div className="form-group">
              <span className="fas fa-search"></span>
              <input type="search" className="search-input" aria-label="Search for a Wikipedia article..." placeholder="Search for a Wikipedia article..." onChange={(event) => this.handleChange(event)} value={this.state.searchInput} required />
            </div>
          </form>
          <p>...or read a <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank">random Wikipedia article</a></p>
          <div className="spinner">
            <span className="fa fa-sync-alt fa-spin fa-2x fa-fw" aria-label="Loading..."></span>
          </div>
          <ResultsList results={this.state.searchResults} />
          <p className="error-message"><span className="fa fa-exclamation-triangle fa-lg fa-fw"></span>{this.state.errorMessage}</p>
        </main>
        <footer>Coded by <a href="../portfolio" target="_blank">Autumn Bullard</a></footer>
      </div>
    );
  }
}
