'use strict';

import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';

import axios from 'axios';

import URLShortenerApp from './URLShortener';
import {
  URLShortenerCreator,
  URLShortenerCreatorAdded,
  URLShortenerCreatorErrors,
  URLShortenerCreatorLoading,
  URLShortenerSelector
} from './URLShortener';

let container;

describe('URLShortenerCreatorAdded', function() {
  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  it('should render the added URLs', async () => {
    for (let i = 0; i < data.length; i++) {
      await render(<URLShortenerCreatorAdded url={data[i]} />);

      const urlText = await document.getElementById('URLShortenerCreatorAdded-a')
      expect(urlText).toBeInTheDocument();
    }
  });

  it('should not render if there are null URLs', async () => {
    const {container} = await render(<URLShortenerCreatorAdded url={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render if the URL is an empty string', async () => {
    const {container} = await render(<URLShortenerCreatorAdded url={''} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render if the URL is an empty list', async () => {
    const {container} = await render(<URLShortenerCreatorAdded url={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('URLShortenerCreatorErrors', function() {
  it('should render an error if available', async () => {
    const error = 'There was an error.'

    await render(<URLShortenerCreatorErrors error={error} />);

    const msgRE = new RegExp(`Error:\\s+${error}`);
    const msg = await screen.findByText(msgRE);

    expect(msg).toBeInTheDocument();
  });

  it('should not render if there is no error', async () => {
    const {container} = await render(<URLShortenerCreatorErrors error={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('URLShortenerCreatorLoading', function() {
  it('should render the loading message if loading', async () => {
    await render(<URLShortenerCreatorLoading loading={true} />);

    const loadingMessage = 'Posting...';
    const renderedMessage = await screen.findByText(loadingMessage);

    expect(renderedMessage).toBeInTheDocument();
  });

  it('should not render if not loading', async () => {
    const {container} = await render(<URLShortenerCreatorLoading loading={false} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe('URLShortenerCreator', function() {
  // URL that can be changed by local handleURLInput();
  let updatedURL;

  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  function handleSubmit() {
  }

  function handleURLInput(event) {
    updatedURL = event.target.value;
  }

  it('should have a label', async () => {
    await render(<URLShortenerCreator url={''} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={false} />);

    const label = screen.getByLabelText(/url/i);

    expect(label).toBeInTheDocument();
  });

  it('should render the create button', async () => {
    await render(<URLShortenerCreator url={''} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={false} />);
    const createButton = await screen.findByRole('button', {'name': /create/i});

    expect(createButton).toBeInTheDocument();
  });

  it('should render the text input', async () => {
    await render(<URLShortenerCreator url={''} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={false} />);
    const input = await document.getElementById('url_input');

    expect(input).toBeInTheDocument();
  });

  it('should display the current URL', async () => {
    const url = 'http://www.gray';
    await render(<URLShortenerCreator url={url} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={false} />);

    const currentURL = await document.getElementById('url_input').value;

    expect(url).toBe(currentURL);
  });

  it('should update the current URL with changes', async () => {
    const url = 'http://www.gray';
    const newURL = 'http://www.grayfarms.org/';
    await render(<URLShortenerCreator url={url} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={false} />);

    const input = await document.getElementById('url_input');
    fireEvent.change(input, {'target': {'value': newURL}});

    expect(newURL).toBe(updatedURL);
  });

  it('should render an error if available', async () => {
    const error = 'There was an error.'

    await render(<URLShortenerCreator url={''} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={error} loading={true} />);

    const errorMessageRE = new RegExp(`Error:\\s+${error}`);
    const errorMessage = await screen.findByText(errorMessageRE);

    expect(errorMessage).toBeInTheDocument();
  });

  it('should render the loading message if loading', async () => {
    await render(<URLShortenerCreator url={''} handleSubmit={handleSubmit} handleURLInput={handleURLInput} urls={null} error={null} loading={true} />);

    const loadingMessage = 'Posting...';
    const renderedMessage = await screen.findByText(loadingMessage);

    expect(renderedMessage).toBeInTheDocument();
  });
});

describe('URLShortenerSelector', function() {
  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  it('should render the dropdown', async () => {
    await render(<URLShortenerSelector urls={data} errors={null} loading={false} />);
    const selector = await document.getElementById('URLShortenerSelectorSelect');

    expect(selector).toBeInTheDocument();
  });

  describe('URLShortenerSelector select', function() {
    const oldWindowLocation = window.location

    beforeAll(() => {
      delete window.location;

      window.location = Object.defineProperties(
        {},
        {
          ...Object.getOwnPropertyDescriptors(oldWindowLocation),
          assign: {
            configurable: true,
            value: jest.fn(),
          },
        },
      )
    });

    beforeEach(() => {
      window.location.assign.mockReset();
    });

    afterAll(() => {
      // restore `window.location` to the `jsdom` `Location` object
      window.location = oldWindowLocation;
    });

    it('should render the added URLs if available', async () => {
      await render(<URLShortenerSelector urls={data} errors={null} loading={false} />);

      for (let i = 0; i < data.length; i++) {
        const urlText = await screen.findByText(data[i].original_url)
        expect(urlText).toBeInTheDocument();
      }
    });

    it('should select the correct URL', async () => {
      await render(<URLShortenerSelector urls={data} errors={null} loading={false} />);

      // Select a URL.
      for (let i = 0; i < data.length; i++) {
        fireEvent.change(await document.getElementById('URLShortenerSelectorSelect'), {'target': {'value': "http://localhost:3001/api/shorturl/" + data[i].short_url}});
        expect(window.location.assign).toHaveBeenCalledWith("http://localhost:3001/api/shorturl/" + data[i].short_url);
      }

      expect(window.location.assign).toHaveBeenCalledTimes(data.length)
    });
  });

  describe('URLShortenerSelector loading', function() {
    it('should render the loading message if loading', async () => {
      await render(<URLShortenerSelector urls={null} errors={null} loading={true} />);

      const loadingMessage = 'Loading...';
      const renderedMessage = await screen.findByText(loadingMessage);

      expect(renderedMessage).toBeInTheDocument();
    });
  });

  describe('URLShortenerSelector error', function() {
    it('should render the error message on errors', async () => {
      const error = 'There was an error.'

      await render(<URLShortenerSelector urls={null} error={error} loading={false} />);

      const errorMessageRE = new RegExp(`Error:\\s+${error}`);
      const errorMessage = await screen.findByText(errorMessageRE);

      expect(errorMessage).toBeInTheDocument();
    });
  });

  describe('URLShortenerSelector with no URLs', function() {
    it('should not render with null URLs', async () => {
      const error = 'There was an error.'

      const {container} = await render(<URLShortenerSelector urls={null} error={null} loading={false} />);

      expect(container).toBeEmptyDOMElement();
    });

    it('should not render with no URLs', async () => {
      const error = 'There was an error.'

      const {container} = await render(<URLShortenerSelector urls={[]} error={null} loading={false} />);

      expect(container).toBeEmptyDOMElement();
    });
  });
});

describe('URL Shortener App', function() {
  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  it('should have the correct title', async () => {
    const title = 'URL Shortener';
    await render(<URLShortenerApp />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    expect(title).toBe(document.title);
  });

  it('should render main headline', async () => {
    await render(<URLShortenerApp />);
    const headline = screen.getByRole('heading', /url shortener/i);
    expect(headline).toBeInTheDocument();
  });
});

describe('URL Shortener App GET all', function() {
  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  beforeEach(() => {
    jest.spyOn(axios, 'get');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render mocked short URLs', async () => {
    axios.get.mockResolvedValue({
      'data': data,
      'status': 200,
      'statusText': 'OK'
    });

    await render(<URLShortenerApp />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    for (let i = 0; i < data.length; i++) {
      const urlText = await screen.findByText(data[i].original_url)
      expect(urlText).toBeInTheDocument();
    }
  });

  it('should render API errors', async () => {
    axios.get.mockRejectedValue(new Error('database error'));

    await render(<URLShortenerApp />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    const errorMessage = await screen.findByText(/Error:\s+database error/i);

    expect(errorMessage).toBeInTheDocument();
  });
});

describe('URL Shortener App POST new', function() {
  const data = [
    {
      'original_url': 'https://www.google.com/',
      'short_url': 1
    },
    {
      'original_url': 'https://www.apple.com/',
      'short_url': 2
    },
    {
      'original_url': 'https://www.facebook.com/',
      'short_url': 3
    },
    {
      'original_url': 'https://www.netflix.com/',
      'short_url': 4
    },
    {
      'original_url': 'https://www.amazon.com/',
      'short_url': 5
    }
  ];

  beforeEach(() => {
    jest.spyOn(axios, 'post');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render a newly shortened URL', async () => {
    axios.post.mockResolvedValue({
      'data': data[0],
      'status': 200,
      'statusText': 'OK'
    });

    await render(<URLShortenerApp />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    const input = await document.getElementById('url_input');
    fireEvent.change(input, {'target': {'value': data[0].original_url}});
    const createButton = await screen.findByRole('button', {'name': /create/i});
    fireEvent.click(createButton);

    // Wait to post and render.
    await waitForElementToBeRemoved(() => screen.getByText(/posting\.\.\./i));

    // Find added URL.
    const urlTextRE = new RegExp(`\\s\*${data[0].short_url}\\s\*:\\s\*${data[0].original_url}\\s\*`);
    const urlText = await screen.findByText(urlTextRE);
    expect(urlText).toBeInTheDocument();
  });

  it('should render API errors', async () => {
    axios.post.mockRejectedValue(new Error('database error'));

    await render(<URLShortenerApp />);
    await waitForElementToBeRemoved(() => screen.getByText(/loading\.\.\./i));

    const input = await document.getElementById('url_input');
    fireEvent.change(input, {'target': {'value': data[0].original_url}});
    const createButton = await screen.findByRole('button', {'name': /create/i});
    fireEvent.click(createButton);
    await waitForElementToBeRemoved(() => screen.getByText(/posting\.\.\./i));

    const errorMessage = await screen.findByText(/Error:\s+database error/i);

    expect(errorMessage).toBeInTheDocument();
  });
});
