# svelte-gallery

> **Note**
> I need to come up with a better name for this project, so it'll probably change in the future.

# Getting Started

## Running

Eventually I'll get this packaged into a nice Docker container, but for now, you need to clone this repo and build it yourself.  
Follow the instructions below but replace step 4 with `npm run build`.

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

### File Structure

`galleries` is the configuration for a site.

This is a standard SvelteKit project, so most stuff happens in `src`:  
`routes` contains the directory structure the user would see (what goes in the URL bar—see the [SvelteKit Routing docs](https://kit.svelte.dev/docs/routing)).  
`lib` contains support files.  
`lib/components` includes UI components that are reused throughout the app (probably).  
`lib/components/gallerysections` contains the different types of sections that can exist in a gallery.  
`lib/modules` includes bits of code that were created for this project but could theoretically work on their own.
