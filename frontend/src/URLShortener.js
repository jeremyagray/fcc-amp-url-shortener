import React, {useState, useEffect} from 'react';
import axios from 'axios';

import './URLShortener.css';

function URLShortenerApp() {
  // New and shortened URLs.
  const [currentURL, setCurrentURL] = useState('');
  const [shortURLs, setShortURLs] = useState([]);
  const [addedURLs, setAddedURLs] = useState([]);

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

      setAddedURLs((addedURLs) => [...addedURLs, response.data]);
      setPostNewLoading(false);
    } catch (error) {
      setPostNewError(error);
      setPostNewLoading(false);
    }

    setCurrentURL('');
  }

  // Load the shortened URLs.
  useEffect(async () => {
    setGetAllLoading(true);

    try {
      const results = await axios.get('http://localhost:3001/api/shorturl/all');
      setShortURLs(results.data);
      setGetAllLoading(false);
    } catch (error) {
      setGetAllError(error);
      setGetAllLoading(false);
    }
  }, [addedURLs]);

  document.title = 'URL Shortener';

  return (
    <div>
      <h1>URL Shortener</h1>
      <URLShortenerCreator url={currentURL} handleSubmit={postURL} handleURLInput={updateURL} urls={addedURLs} error={postNewError} loading={postNewLoading} />
      <URLShortenerSelector urls={shortURLs} error={getAllLoading} loading={getAllError} />
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
      <URLShortenerCreatorAdded urls={props.urls} />
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
  if (props.urls && props.urls.length > 0) {
    return (
      <div className="URLShortenerCreatorAdded">
        <ul>
          {props.urls.map((url) => (
            <li key={url.short_url}><a href={url.original_url}>{url.original_url}</a> was shortened to <a href={"http://localhost:3001/api/shorturl/" + url.short_url}>{url.short_url}</a></li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
}

function URLShortenerSelector(props) {
  function getURL(event) {
    document.location.href = event.target.value;
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
          <select className="" onChange={getURL}>
            <option value="">Select</option>
            {props.urls.map((url) => (
              <option key={url.short_url} value={"http://localhost:3001/api/shorturl/" + url.short_url}>{url.original_url}</option>
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
  URLShortenerCreatorAdded,
  URLShortenerCreatorErrors,
  URLShortenerCreatorLoading,
  URLShortenerSelector
}
