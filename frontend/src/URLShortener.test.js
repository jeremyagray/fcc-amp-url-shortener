import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';

import URLShortenerApp from './URLShortener';
import {
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
    await render(<URLShortenerCreatorAdded urls={data} />);

    for (let i = 0; i < data.length; i++) {
      const urlText = await screen.findByText(data[i].original_url)
      expect(urlText).toBeInTheDocument();
    }

    expect(await screen.findAllByText('was shortened to')).toHaveLength(5);
  });

  it('should not render if there are null URLs', async () => {
    const {container} = await render(<URLShortenerCreatorAdded urls={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should not render if there are no URLs', async () => {
    const {container} = await render(<URLShortenerCreatorAdded urls={[]} />);

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

  // it('should render main headline', async () => {
  //   await render(<URLShortenerApp />);
  //   const headline = await screen.findByText(/url shortener/i);
  //   expect(headline).toBeInTheDocument();
  // });

  // it('should render main headline', async () => {
  //   // await act(() => {
  //   // render(<URLShortenerApp />, container);
  //   render(<URLShortenerApp />);
  //   const headline = await screen.findByText(/url shortener/i);
  //   // });
  //   expect(headline).toBeInTheDocument();
  // });

  // test('renders form title', () => {
  //   render(<URLShortenerApp />);
  //   const h2 = screen.getByText(/create url/i);
  //   expect(h2).toBeInTheDocument();
  // });

  // it('should render form button', async () => {
  //   await render(<URLShortenerApp />);
  //   const createButton = await screen.findByRole('button', {'name': /create/i});
  //   expect(createButton).toBeInTheDocument();
  // });

  // test('renders list title', () => {
  //   render(<URLShortenerApp />);
  //   const h2 = screen.getByText(/links/i);
  //   expect(h2).toBeInTheDocument();
  // });
});
