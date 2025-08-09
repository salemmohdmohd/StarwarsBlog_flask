In this article and video I'm going to share how I'm building this type of project in 2025. The main change I've introduced since I documented my 2020 process is that now I'm using Vite (French word that is pronounced "veet" and means "quick") instead of create-react-app to scaffold the React application, since the latter isn't maintained anymore.

Requirements
This is a hands-on tutorial, and I hope you are going to follow along and create the project I'm going to describe along with me. Before we get started, you may want to make sure you have your Python and JavaScript interpreters installed. For your reference, these are the versions that I'm currently using:

Python, version 3.12
Node.js, version 22
Note that it is not strictly necessary that you use these versions. Any relatively recent versions of Python and Node.js should work as well. In fact, by the time you read this it may be possible that these versions are too old, so always make sure that you use versions that have not reached their end of life.

To make sure that your interpreters are installed and working, open a terminal window and check them as follows:

$ python --version
Python 3.12.7
$ node --version
v22.11.0
Creating a Starter React Project
The structure that I normally use has the React front end as the top-level project, so the first step is to create this project. Open a terminal window and change to an appropriate parent directory for your project. Then enter the following command:

$ npm create vite@latest react-with-flask -- --template react
You may not have seen the npm create command before, but it is the same as npm init and also the npx create that was favored by create-react-app. These all end up doing the same thing, which is to bootstrap JavaScript projects.

Vite is designed to scaffold JavaScript and TypeScript projects for a lot of frameworks. The command above selects the react template. If you prefer working with TypeScript, use the react-ts template instead. If you want to try a framework other than React, then see if you find a template for it in the documentation.

After launching the above command, Vite may ask you to confirm that it can install additional packages that it needs. Once you accept and these packages are installed, it will create a new project directory with the name react-with-flask (feel free to change this to your favorite project name in the command above). Inside this directory Vite will set up a simple React starter project.

You can now change to the project directory and launch it:

$ cd react-with-flask
$ npm install
$ npm run dev
The npm install command installs all the dependencies that are defined in the project's package.json. This includes the React framework.

The npm run dev command launches the Vite development web server. Your terminal screen should now show something similar to this:

VITE v6.3.5 ready in 138 ms

➜ Local: http://localhost:5173/
➜ Network: use --host to expose
➜ press h + enter to show help
As indicated, you can press h + enter to see the list of supported commands. The most important one is o + enter, which opens the project in your default web browser. This is how the starter React application looks in my browser:

React starter application screenshot

The Vite web server has a feature called "hot module reloading" or HMR that automatically refreshes the browser as you change source files. This is a very convenient feature that works as long as you leave the Vite server running. I recommend that you take advantage of this feature, so leave this terminal window running the Vite server and open a second terminal to continue working on the project.

Creating the Flask Back End
Okay, the front end is now up and running, so let's have a look at the Python side.

Let's start by creating a directory for the Python API server inside the React project. Make sure you run the following commands while your current directory is the main folder of the React project, which I named react-with-flask:

$ mkdir api
$ cd api
Now I'm going to create a Python virtual environment in the api subdirectory. There are many tools that can help with this, and a ton of different ways to do it, so here you are welcome to use the method that you like the best. In my case, I'm going to go with the traditional method, which does not require installing any additional tools. The following command creates a virtual environment with name venv in the current directory:

$ python -m venv venv
If you are working on your project on a bash or zsh shell, then you can activate the new virtual environment with:

$ source venv/bin/activate
If you use PowerShell or CMD on Microsoft Windows, then the activation command is:

$ venv\Scripts\activate
When the virtual environment is activated your terminal session is configured to use the environment by default, for example when you run python or pip. You can confirm the activation in your terminal prompt, which should include the name of the environment:

(venv) $ \_
Now you can use pip to install the dependencies of the Python server. For a minimal Flask server, the dependencies are:

(venv) $ pip install flask python-dotenv
The Flask server that I'm going to use in this article has just six lines of code and features an endpoint that returns the current time. Enter the following code in a file called api.py, still in the api subdirectory:

import time
from flask import Flask

app = Flask(**name**)

@app.route('/api/time')
def get_current_time():
return {'time': time.time()}
The most convenient option to configure the Flask application is to create a .env file. Copy the following two lines to this file:

FLASK_APP=api.py
FLASK_ENV=development
The back end is now configured, so you can go back to the parent directory:

$ cd ..
The Flask development server runs on port 5000 by default, and as you saw above, Vite uses port 5173 for its server. Having to deal with two different ports is a complication that I prefer to avoid, so what often do is to configure the Vite development server to forward all API requests to port 5000. This makes everything simpler, because the React application can then issue the API requests without having to specify a hostname or a port, as you will soon see.

To configure the API request forwarding Vite provides a proxy server option. Open the file vite.config.js and add the server section, along with its proxy sub-section:

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
plugins: [react()],
server: {
proxy: {
'/api': 'http://localhost:5000',
},
},
})
With this, Vite is going to know that any incoming requests that have a URL that starts with /api have to be forwarded to http://localhost:5000, which is where Flask is running.

You probably know that the Flask server can be started with the flask run command from the terminal. However, when I'm working on a mixed JavaScript and Python project I prefer to consolidate all my project commands, and the most convenient way to do that is to add my Python commands to the package.json file, so that they can be triggered as npm run scripts, just like the JavaScript ones.

Open the file package.json and find the scripts section. This is where all the React commands are configured. In this section, add a api command defined as follows:

// ...
"scripts": {
"dev": "vite",
"build": "vite build",
"lint": "eslint .",
"preview": "vite preview",
"api": "cd api && venv/bin/flask run --no-debugger"
},
// ...
The new api command changes to the api directory and then runs the flask run command. The flask command is given with its path, which is inside the virtual environment created earlier. This ensures that the command works even when the virtual environment isn't activated.

I have added the --no-debugger option, because the Flask debugger only makes sense when Flask renders content directly to the browser. In a pure Flask project, the debugger takes over the browser when the server crashes. While this is a nice Flask feature, the debugger will not work in this application because the browser page is controlled by React and not Flask. In an API project when there is a crash the best the server can do is return a 500 error, which is what's going to happen when the debugger is disabled.

With the project configured in this way you can open two terminal windows and run npm run dev in one to start the front end, and npm run api in the other to start the back end.

To confirm that your Flask server is working, run npm run api on your second terminal window. Then open a third window and issue a test request using curl:

$ curl http://localhost:5000/api/time
{"time":1748215288.618898}
The response from this request comes in JSON format, which is the friendlier format to use in APIs. The time units used in this response are called epoch time, a standard time format that represents the number of seconds since January 1, 1970.

Integrating the Front and Back Ends
We now have the front and back ends configured and running, but they are not talking to each other yet. In this section I'll show you how to make an API call from the front end using the fetch() function.

The core logic in the starter React application created by Vite is in the file src/App.jsx, so open this file in your editor.

First of all, add React's useEffect function as an import. You can add this in the same line where useState is imported:

import { useState, useEffect } from 'react'
Next, add a new state inside the body of the App() function. You can add it right below the existing useState() line:

const [currentTime, setCurrentTime] = useState(0);
The currentTime state is initialized to 0, and will be assigned the time value returned by the Flask server. To make the API call that retrieves the time, add a useEffect() call, below the useState() call you just added:

useEffect(() => {
fetch('/api/time').then(res => res.json()).then(data => {
setCurrentTime(data.time);
});
}, []);
This code creates a new side effect that is going to run automatically when the component renders to the page. The [] that is given as a second argument to the useEffect() function is important, as it indicates that this side effect does not have any dependencies. This essentially means that the function given as a first argument is going to run just once when the component is initially rendered and never again.

The last part is to display the date somewhere in the page. The App() function ends with a return statement that includes the contents of the component in JSX format. You can add a new line somewhere inside this content, for example below the counter button. Here is an example line that you can add to show the time:

        <p>The current time is {new Date(currentTime * 1000).toLocaleString()}.</p>

This takes the currentTime state and renders it as a local date and time, according to the locale configured in the browser.

In case you need a bit more guidance to figure out how to edit this file, here is my complete src/App.jsx with all the changes:

import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
const [count, setCount] = useState(0)
const [currentTime, setCurrentTime] = useState(0);

useEffect(() => {
fetch('/api/time').then(res => res.json()).then(data => {
setCurrentTime(data.time);
});
}, []);

return (
<>
<div>
<a href="https://vite.dev" target="_blank">
<img src={viteLogo} className="logo" alt="Vite logo" />
</a>
<a href="https://react.dev" target="_blank">
<img src={reactLogo} className="logo react" alt="React logo" />
</a>
</div>
<h1>Vite + React</h1>
<div className="card">
<button onClick={() => setCount((count) => count + 1)}>
count is {count}
</button>
<p>The current time is {new Date(currentTime \* 1000).toLocaleString()}.</p>
<p>
Edit <code>src/App.jsx</code> and save to test HMR
</p>
</div>
<p className="read-the-docs">
Click on the Vite and React logos to learn more
</p>
</>
)
}

export default App
As soon as you save this file, the browser should update and include the date and time in the page, between the button and the "Edit ..." text.

React starter application screenshot

If you are not very familiar with how React manages state updates you may think the date and time suddenly appearing in the page is a bit magical, but this is actually why React is so powerful. The call to setCurrentTime() that is made when the Flask API delivers its response is what triggers the page to update. React keeps track of where currentTime is used, so it can re-render any components that use this state variable when its value changes.
