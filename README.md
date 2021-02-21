# URL Shortener Full Stack Application

## Roadmap

### Front End

1. Update URLShortenerCreator to handle existing URLs.
1. Add URL deletion.
1. Add sorting by number, URL, title, protocol, popularity, and times.
1. Add user management.

### Back End

[] Implement DELETE route.
[] Add user management.
[] Generate coverage report when ran in 'test' mode.
[x] Add timestamps, visits, protocol, and title fields.  (completed)
[x] Check existence before adding new URLs.  (completed)
[x] Refactor controller functions to separate route logic and database
logic to ease testing.

# API Project: URL Shortener Microservice for freeCodeCamp

[![Run on
Repl.it](https://repl.it/badge/github/freeCodeCamp/boilerplate-project-urlshortener)](https://repl.it/github/freeCodeCamp/boilerplate-project-urlshortener)

## User Stories

1. I can POST a URL to `[project_url]/api/shorturl/new` and I will
receive a shortened URL in the JSON response. Example :
`{"original_url":"www.google.com","short_url":1}`
2. If I pass an invalid URL that doesn't follow the valid
`http(s)://www.example.com(/more/routes)` format, the JSON response
will contain an error like `{"error":"invalid URL"}`. *HINT*: to be
sure that the submitted url points to a valid site you can use the
function `dns.lookup(host, cb)` from the `dns` core module.
3. When I visit the shortened URL, it will redirect me to my original
link.


### Creation Example:

POST [project_url]/api/shorturl/new - body (urlencoded) :  url=https://www.google.com

### Usage:

[this_project_url]/api/shorturl/3

### Will redirect to:

https://www.freecodecamp.org/forum/
