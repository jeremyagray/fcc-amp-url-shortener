import React, {useState, useEffect} from 'react';

function URLShortener() {
  return (
      <div>
      <h1>URL Shortener</h1>
      <URLShortenerCreate />
      <URLShortenerList />
      </div>
  );
}

function URLShortenerCreate() {
  return (
      <div className="URLShortenerCreate">
      <h2>Create URL</h2>
      <form action="http://localhost:3001/api/shorturl/new" method="POST">
      <label htmlFor="url_input">URL</label>
      <input id="url_input" type="text" name="url" defaultValue="https://www.grayfarms.org" />
      <input type="submit" value="Create" />
      </form>
      </div>
  );
}

function URLShortenerList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    fetch("http://localhost:3001/api/shorturl/all")
      .then(response => response.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])

  if (error) {
    return (
        <div className="URLShortenerList">
        <h2>Links</h2>
        <ul>
          <li key="1">Error:  {error.message}</li>
        </ul>
        </div>
    );
  } else if (!isLoaded) {
    return (
        <div className="URLShortenerList">
        <h2>Links</h2>
        <ul>
          <li key="1">Loading...</li>
        </ul>
        </div>
    );
  } else {
    return (
        <div className="URLShortenerList">
        <h2>Links</h2>
        <ul>
        {items.map((url) => (
          <li key={url.short_url}><a href={"http://localhost:3001/api/shorturl/" + url.short_url}>{url.original_url}</a></li>
        ))}
      </ul>
        </div>
    );
  }
}

export default URLShortener;
