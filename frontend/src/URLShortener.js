'use strict';

import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './URLShortener.css';

function URLShortenerApp() {
  // New and shortened URLs.
  const [currentURL, setCurrentURL] = useState('');
  const [shortURLs, setShortURLs] = useState([]);
  const [addedURL, setAddedURL] = useState('');

  // Loading statuses.
  const [getAllLoading, setGetAllLoading] = useState(false);
  const [getShortLoading, setGetShortLoading] = useState(false);
  const [postNewLoading, setPostNewLoading] = useState(false);

  // Errors.
  const [getAllError, setGetAllError] = useState(null);
  const [getShortError, setGetShortError] = useState(null);
  const [postNewError, setPostNewError] = useState(null);

  // Updates value of current URL from form input.
  function updateURL(event) {
    event.persist();
    setCurrentURL(event.target.value);
  }

  // POST a URL to be shortened to the API.
  async function postURL(event) {
    event.persist();
    // Suppress page reloading.
    event.preventDefault();

    setPostNewLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3001/api/shorturl/new',
        {
          'url': currentURL
        });

      setAddedURL(response.data);
      setPostNewLoading(false);
    } catch (error) {
      setPostNewError(error.message);
      setPostNewLoading(false);
    }

    setCurrentURL('');
  }

  // Load the shortened URLs.
  useEffect(() => {
    let isMounted = true;
    setGetAllLoading(true);

    async function fetchData() {
      try {
        const results = await axios.get('http://localhost:3001/api/shorturl/all');
        if (isMounted) {
          setShortURLs(results.data);
          setGetAllLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setGetAllError(error.message);
          setGetAllLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [addedURL]);

  document.title = 'URL Shortener';

  return (
    <div>
      <h1>URL Shortener</h1>
      <URLShortenerCreator url={currentURL} handleSubmit={postURL} handleURLInput={updateURL} added={addedURL} error={postNewError} loading={postNewLoading} />
      <URLShortenerSelector urls={shortURLs} error={getAllError} loading={getAllLoading} />
    </div>
  );
}

function URLShortenerCreator(props) {
  return (
    <div className="URLShortenerCreator">
      <form onSubmit={props.handleSubmit}>
        <label htmlFor="url_input">URL</label>
        <input id="url_input" type="text" name="url" value={props.url} onChange={props.handleURLInput} />
        <input type="submit" value="Create" />
      </form>
      <URLShortenerCreatorErrors error={props.error} />
      <URLShortenerCreatorLoading loading={props.loading} />
      <URLShortenerCreatorAdded url={props.added} />
    </div>
  );
}

function URLShortenerCreatorErrors(props) {
  if (props.error) {
    return (
      <div className="URLShortenerCreatorError error">
        <p>Error:  {props.error}</p>
      </div>
    );
  }

  return null;
}

function URLShortenerCreatorLoading(props) {
  if (props.loading) {
    return (
      <div>
        <p>Posting...</p>
      </div>
    );
  }

  return null;
}

function URLShortenerCreatorAdded(props) {
  if (props.url && props.url !== '' && props.url.length !== 0) {
    return (
      <div className="URLShortenerCreatorAdded">
        <p className="URLShortenerCreatorAdded-p">
          <a
            className="URLShortenerCreatorAdded-a"
            id="URLShortenerCreatorAdded-a"
            href={"http://localhost:3001/api/shorturl/" + props.url.short_url}
          >
            {props.url.short_url}:  {props.url.original_url}
          </a>
        </p>
      </div>
    );
  }

  return null;
}

function URLShortenerSelector(props) {
  function getURL(event) {
    window.location.assign(event.target.value);
  }    

  if (props.loading) {
    return (
      <div className="URLShortenerSelector">
        <p>Loading...</p>
      </div>
    );
  }
  else if (props.error) {
    return (
      <div className="URLShortenerSelector error">
        <p>Error:  {props.error}</p>
      </div>
    );
  }
  else if (props.urls && props.urls.length > 0) {
    return (
      <div className="URLShortenerSelector">
        <form>
          <select className="" id="URLShortenerSelectorSelect" onChange={getURL}>
            <option value="" id="URLShortenerSelectorShortURL-default">Select</option>
            {props.urls.map((url) => (
              <option key={url.short_url} id={"URLShortenerSelectorShortURL-" + url.short_url} value={"http://localhost:3001/api/shorturl/" + url.short_url}>{url.original_url}</option>
            ))}
          </select>
        </form>
      </div>
    );
  }
  else {
    return null;
  }
}

export default URLShortenerApp;

export {
  URLShortenerCreator,
  URLShortenerCreatorAdded,
  URLShortenerCreatorErrors,
  URLShortenerCreatorLoading,
  URLShortenerSelector
}
