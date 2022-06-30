# svelte-gallery

> **Note**
> This platform is under heavy development and there may be breaking changes at any time until version 1.0.0. Until then, breaking changes will be a semver "minor" version (0.xx.0). After version 1.0.0, we will follow regular [semver conventions](https://semver.org/).

# Getting Started

## Running

Eventually I'll get this published on a container registry, but for now, you need to clone the repo and have Docker build the image.

> **Note**
> This assumes you have `docker` and `docker-compose` already installed and working. If not, install [Docker](https://docs.docker.com/engine/install/) and [Compose](https://docs.docker.com/compose/install/) and come back.

1. Clone this repo
    ```console
    ~$ git clone https://github.com/i-am-gizm0/svelte-gallery.git
    ~$ cd svelte-gallery
    ```
2. Copy `.env.example` to `.env` and configure it to your liking
    ```console
    ~/svelte-gallery$ cp .env.example .env
    ```
3. Build and start the image and start publishing!
    ```console
    ~/svelte-gallery$ docker-compose up -d
    ```

### Site File Structure

Most of what you'll do will happen in `galleries`.

> **Note**
> An example gallery is available in the `galleries` folder.

### site.xml
This is the main configuration file for the site. It contains a top-level `site` element with the following children:
- `nav` contains the navigation links that go in the bar at the top.
    - It consists of `group`s, which correspond to a dropdown menu. A `group` can have a `name` attribute, which is the text displayed in the navbar.
        - A `group` contains multiple `gallery` elements, which have a `path` attribute (the link to the gallery) and a `name`, again the text displayed
- `collections` contains a group of galleries to be presented to a visitor
    - It consists of `collection`s, which have an `id` and a `name`.
        - A `collection` contains multiple `gallery` elements, which have a `path` attribute (the link to the gallery)
- `defaults` contains definitions of default values for places where a value is not defined elsewhere.
    - `header-image` dictates the default header image. This will be displayed on the home page and any other gallery that doesn't have a header image defined in its [`gallery.xml`](#gallery.xml)
### gallery.xml
The `galleries` folder also contains the galleries themselves. Each folder within the `galleries` folder is a gallery, and the name of the folder is the slug (so `galleries/testgal` would be `https://<yourdomain>/testgal`).
Within that folder will be the images in that gallery, along with a `gallery.xml`. It will contain a top-level `gallery` element with the following children
- `meta` defines some properties of the gallery.
    - `title` is the simple title of the gallery
    - `overrides` are different versions of the title: Currently supported are `small-large` and `large-small`, each with `small` and `large` attributes, for defining how the name should be displayed when styled.
    - `description` (optional) is some text or HTML that will be displayed under the gallery's name in the header.
    - `header-image` defines the header image of the gallery. It contains one [`img`](#img) element.
- `sections` defines the sections of the gallery. There is no limit on the number of sections or their types. Section types can be repeated.
    - A Markdown section (`<section type="markdown">`) will display rich text and is written in [Markdown](https://www.markdownguide.org/). There are currently some limits on the type of HTML elements that can be included.
    - A Featured section (`<section type="featured">`) will display one image at the full width of the page. It contains one [`img`](#img) element.
    - Probably the most common section will be the Gallery section (`<section type="gallery">`). It defines a group of images which can be interacted with (opened in a lightbox). It can contain as many [`img`](#img) elements are you'd like.
- `resources` defines images that can be accessed from elsewhere in the gallery by their `id`. It contains at least one [`img`](#img) element that has an `id` attribute.

#### `img`

Images are defined by `<img>` elements, which have similar syntax to HTML.
> **Note**
> An `<img>` should not contain any content, so it is usually written as a self-closing tag (`<img ... />`) to save space.
An image must be one of two forms:
1. **Link**  
   This does not define anything for itself, but instead links to an image defined in `resources`. It has a single `link` attribute that references the `id` of a resource image, where `<img id="img01" ... />` would be referenced by `<img link="#img01" />`
2. **Resource**  
   This defines an image. It contains the following attributes
   - `src` - The location of the image. If served locally, this is the name of a file in the same gallery. It may also be the URL of an external image (such as from Unsplash).
   - `blurhash` - The [Blurhash](https://blurha.sh/) representation of the image. Used to render a placeholder while the real image loads.
   - `width` and `height` - self explanatory: the width and height of the image
   - `id` (optional) - the ID, referenced by a link (above).
   - `alt` (optional) - alt text for the image, used for screen readers
   - `title` (optional) - a caption, displayed when the image is full-screen

## Contributing

> **Note**
> This assumes you have `npm` already installed and working. If not, [install Node](https://nodejs.org/) and come back

1. Clone this repo
    ```console
    ~$ git clone https://github.com/i-am-gizm0/svelte-gallery.git
    ~$ cd svelte-gallery
    ```
2. Install the dependencies
    ```console
    ~/svelte-gallery$ npm install
    ```
3. Copy `.env.example` to `.env` and configure it to your liking
    ```console
    ~/svelte-gallery$ cp .env.example .env
    ```
4. Start the development server and start writing code!
    ```console
    ~/svelte-gallery$ npm run dev -- --open
    ```

If you don't know Javascript or Typescript, [start with the Typescript tutorial](https://www.typescriptlang.org/docs/).
If you don't know Svelte or SvelteKit, [start with Svelte's tutorial](https://svelte.dev/tutorial/basics) and [skim the SvelteKit docs](https://kit.svelte.dev/docs/introduction).

### Development File Structure

`galleries` is the configuration for a site.

This is a standard SvelteKit project, so most stuff happens in `src`:  
`routes` contains the directory structure the user would see (what goes in the URL bar—see the [SvelteKit Routing docs](https://kit.svelte.dev/docs/routing)).  
`lib` contains support files.  
`lib/components` includes UI components that are reused throughout the app (probably).  
`lib/components/gallerysections` contains the different types of sections that can exist in a gallery.  
`lib/modules` includes bits of code that were created for this project but could theoretically work on their own.
