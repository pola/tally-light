# tally-light
This is a piece of software that adds tally like-like functionality to your studio. It works by having a plugin in Open Broadcaster Software (OBS) or Atem Mini send notifications to a web server about changes to the scenes and sources, and then have one or several web browers listen and react to those changes.

Here is a short demonstration of how it works in OBS Studio: https://youtu.be/68bge4QS_1Q

## Installation
The installation consists of two parts; the web server and a plugin of your choice.

### Web server installation
The web server resides in the `www-server` folder. To use it, you need Node and NPM.
* Run `npm install` to install the required dependencies.
* Copy `config.example.js` to `config.js` and edit the variables.
* Run `node index.js` to run the actual server.

## Plugin for OBS Studio
### Installation
The OBS plugin resides in the `obs-studio` folder.
* Copy the file `config.example.py` to a new file `config.py` and edit the variables appropriately.
* Install dependencies with `pip3 install -r requirements.txt`.
* In OBS, select `Tools` and then `Scripts` in the menu. Add the plugin by navigating to `obs-tally-light.py`.
* Make sure the script console doesn't give you any error message. If it complains about the module `requests` not being found, make sure that `config.py` points to the path where you that Python library is installed.

### Running
In OBS, make sure you have at least one source.
* Note down the name, e.g. `Window Capture 1`.
* Open a web browser and navigate to the URL of your web server. The web browser will ask you for a _source name_, to which you reply with the name you have in OBS.
* Add another source in OBS, with a different name, and repeat the process in the web browser in a new instance (tab or window), with the name of the new source.
* Switch sources or scenes in OBS, and the switches should be reflected in the web browser instances.


## Plugin for Atem Mini
### Installation
The Atem Mini plugin resides in the `atem-mini` folder.
* Copy the file `config.example.py` to a new file `config.py` and edit the variables appropriately.
* Install dependencies with `pip3 install -r requirements.txt`.

### Running
Make sure that Atem Mini is running and that it is connected to the network. The IP address of Atem Mini can be configured using the software provided by Blackmagic.
* Run `python3 atem-tally-light.py` inside the `atem-mini` folder and make sure it stays up, running.
* Open a web browser and navigate to the URL of your web server. The web browser will ask you for a _source name_, to which you reply with the number that your camera has, e.g. 1, 2, 3 or 4.
* Repeat the process in a new instance of the web browser (tab or window), with the number of another camera.
* Switch outputs in Atem Mini. The switches should be reflected in the web browser instances.
