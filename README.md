![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Personality Tool 

Personality Tool for the [Editor.js](https://editorjs.io).

![](https://capella.pics/064afd7b-b67e-482b-b92a-d445b098def2.jpg)

## Features

This tool allows you to create Personality block in your articles.

**Note** Tool requires server-side implementation for image uploading. See [backend response format](#server-format) for more details.

## Get the package

You can get the package using any of these ways.

### Install via NPM

Get the package

```shell
npm i --save-dev @editorjs/personality
```

Include module at your application

```javascript
const Personality = require('@editorjs/personality');
```

### Download to your project's source dir

1. Upload folder `dist` from repository
2. Add `dist/bundle.js` file to your page.

### Load from CDN

You can load specific version of package from [jsDelivr CDN](https://cdn.jsdelivr.net/npm/@editorjs/personality@2.0.0).

`https://cdn.jsdelivr.net/npm/@editorjs/personality@2.0.0`

Then require this script on page with Editor.js through the `<script src=""></script>` tag.

## Usage

Add a new Tool to the `tools` property of the Editor.js initial config.

```javascript
var editor = EditorJS({
  ...

  tools: {
    ...
    personality: {
      class: Personality,
      config: {
        endpoints: {
          byFile: 'http://localhost:8008/uploadFile', // Your backend image file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading image by Url
        }
      }
    }
  }

  ...
});
```

## Config Params

Personality Tool supports these configuration parameters:

| Field | Type     | Description        |
| ----- | -------- | ------------------ |
| endpoints | `{byFile: string, byUrl: string}` | Endpoints for photo uploading. <br> Contains 2 fields: <br> __byFile__ - for file uploading <br> __byUrl__ - for uploading by URL |
| field | `string` | (default: `image`) Name of uploaded image field in POST request |
| types | `string` | (default: `image/*`) Mime-types of files that can be [accepted with file selection](https://github.com/codex-team/ajax#accept-string).|
| additionalRequestData | `object` | Object with any data you want to send with uploading requests |
| additionalRequestHeaders | `object` | Object with any custom headers which will be added to request. [See example](https://github.com/codex-team/ajax/blob/e5bc2a2391a18574c88b7ecd6508c29974c3e27f/README.md#headers-object) |
| namePlaceholder | `string` | (default: `Name`) Placeholder for name field |
| descriptionPlaceholder | `string` | (default: `Description`) Placeholder for description field |
| linkPlaceholder | `string` | (default: `Link`) Link field placeholder |
| uploader | `{{uploadByFile: function, uploadByUrl: function}}` | Optional custom uploading methods. See details below. |

Note that if you don't implement your custom uploader methods, the `endpoints` param is required.

## Output data

This Tool returns `data` with following format

| Field          | Type      | Description                      |
| -------------- | --------- | ---------------------------------|
| name           | `string`  | Person's name                    |
| description    | `string`  | Person's description             |
| link           | `string`  | Link to person's website         |
| photo          | `string`  | Uploaded image url from backend. |

```json
{
    "type" : "personality",
    "data" : {
        "name" : "Elon Musk",
        "description" : "Elon Reeve Musk FRS is a technology entrepreneur, investor, and engineer. He holds South African, Canadian, and U.S. citizenship and is the founder",
        "link" : "https://twitter.com/elonmusk",
        "photo" : "https://capella.pics/3c0e1b97-bc56-4961-b54e-2a6c2c3260f2.jpg"
    }
}
```

Scenario:

1. User select file from the device
2. Tool sends it to **your** backend (on `config.endpoint.byFile` route)
3. Your backend should save file and return file data with JSON at specified format.
4. Personality tool shows saved image and stores server answer

So, you can implement backend for file saving by your own way. It is a specific and trivial task depending on your
environment and stack.

Response of your uploader **should** cover following format:

```json5
{
    "success" : 1,
    "file": {
        "url" : "https://capella.pics/3c0e1b97-bc56-4961-b54e-2a6c2c3260f2.jpg",
    }
}
```

**success** - uploading status. 1 for successful, 0 for failed

**file** - uploaded file data. **Must** contain an `url` field with full public path to the uploaded image.

### Uploading by pasted URL

Scenario:

1. User pastes an URL of the image file to the Editor
2. Editor pass pasted string to the Image Tool
3. Tool sends it to **your** backend (on `config.endpoints.byUrl` route) via 'url' POST-parameter
3. Your backend should accept URL, **download and save the original file by passed URL** and return file data with JSON at specified format.
4. Personality tool shows saved image and stores server answer

Response of your uploader should be at the same format as described at «[Uploading files from device](#from-device)» section


### Uploading by drag-n-drop or from Clipboard

Your backend will accept file as FormData object in field name, specified by `config.field` (by default, «`image`»).
You should save it and return the same response format as described above.

## Providing custom uploading methods

As mentioned at the Config Params section, you have an ability to provide own custom uploading methods.
It is a quite simple: implement `uploadByFile` and `uploadByUrl` methods and pass them via `uploader` config param.
Both methods must return a Promise that resolves with response in format that described at the [backend response format](#server-format) section.


| Method         | Arguments | Return value | Description |
| -------------- | --------- | -------------| ------------|
| uploadByFile   | `File`    | `{Promise.<{success, file: {url}}>}` | Upload file to the server and return an uploaded image data | 
| uploadByUrl    | `string`  | `{Promise.<{success, file: {url}}>}` | Send URL-string to the server, that should load image by this URL and return an uploaded image data | 

Example:

```js
import Personality from '@editorjs/personality';

var editor = EditorJS({
  ...

  tools: {
    ...
    personality: {
      class: Personality,
      config: {
        /**
         * Custom uploader
         */
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByFile(file){
            // your own uploading logic here
            return MyAjax.upload(file).then(() => {
              return {
                success: 1,
                file: {
                  url: 'https://codex.so/upload/redactor_images/o_80beea670e49f04931ce9e3b2122ac70.jpg',
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              };
            });
          },

          /**
           * Send URL-string to the server. Backend should load image by this URL and return an uploaded image data
           * @param {string} url - pasted image URL
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByUrl(url){
            // your ajax request for uploading
            return MyAjax.upload(file).then(() => {
              return {
                success: 1,
                file: {
                  url: 'https://codex.so/upload/redactor_images/o_e48549d1855c7fc1807308dd14990126.jpg',,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }
              }
            })
          }
        }
      }
    }
  }

  ...
});
```
