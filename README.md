<!-- 
            Things to Discuss:
                Backend Image fetching - url like "https://gutenberg.org/cache/epub/67098/images/" returns HTML file with table
                    - how to access list of images directly?
                    - is this easier through altpoet (or anything other than directly through PG urls?)
                Can do so directly thru <iframe> in prod bc no cross-origin issues, if that's easier
                Prod server = real, dev server = localhost webserver
                Essentially, either: 
                    - pull from backend and update directly, then find corresponding <img> in <iframe> for UI
                    - list all <img> in <iframe>, then connect those to backend using <img> ID number to update
                Using Bootstrap for Component Framework
            Meeting 2:
                Write how to run locally (both react and node server)
                Include API extras and set up integration
                Alert: Alt is empty, are sure you want to submit
                List multiple annotations / alt texts in image subdescription text area
                optional / not pressing: newer elements use <figure> instead of <img> sometimes
                    figure out how to include in list, and also highlight difference

            Meeting 3:
              Update UI to look fancier
              Add save button next to submit to save edited alt text on main branch (not api post)
              Later: update api calls for img objs instead of img urls
              multiple alt texts support?
-->

# alt-text-editor
Free Ebook Foundation alt text PG react app

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#setting-up-react-app">Setting up React app</a>
    </li>
    <li>
      <a href="#nodejs-proxy-server-and-how-it-works-with-react-and-vite">NodeJS proxy server and how it works with React and Vite</a>
    </li>
  </ol>
</details>

## Setting up React app

I'm using NodeJS v22.13.1 and npm v10.9.2 for this project. Older versions shouldn't matter unless they're really old but if there's issues compiling or executing I'm putting this here for reference. I'm not using Docker because proxy server communication doesn't work between containers, so you'll have to run it locally. 

1. Clone the repo and open terminal/CLI ("terminal 1") at `alt-text-react-app` directory. Make sure you have NodeJS and npm installed.
    1. Run `npm install` in terminal 1.
2. Open separate terminal ("terminal 2") at `alt-text-test-server` directory.
    1. Run `node webserver.js` in terminal 2.
3. Run `npm run dev` in terminal 1.
4. You should now be able to access the React app at [http://localhost:5173/](http://localhost:5173/) on your machine in a browser.

## NodeJS proxy server and how it works with React and Vite

You can ignore the .csv file and the Python script with env dependency files. That was just to download the images to host locally all at once.

`index.html` is the Winnie the pooh book, and `webserver.js` is the NodeJS server, which hosts the page and the static image files at [http://localhost:8000/](http://localhost:8000/) when running. 

The React app uses the `vite.config.js` file to proxy [http://localhost:8000/](http://localhost:8000/) like subpages of the localhost port that it's running on. The node webserver hosts the html file at '/iframe', which the React app is redirected to by the config file when it requests it. This eliminates CORS issues with being able to access the DOM of Winnie the Pooh. 

This doesn't work with Docker because they can only proxy within their own contains, not between. It also means that this way of testing only works on the dev build, not the production build, because the `vite.config.js` file isn't included (like `package.json`), hence `npm run dev` instead of `npm run build` and `serve -s dist`. 

