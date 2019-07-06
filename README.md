![](https://badgen.net/badge/Editor.js/v2.0/blue)

# Personality Tool 

Personality Tool for the [Editor.js](https://editorjs.io).

![](https://capella.pics/064afd7b-b67e-482b-b92a-d445b098def2.jpg)

## Features

This tool allows you to create Personality block in your articles.

**Note** Tool requires server-side implementation for file uploading. See [backend response format](#server-format) for more details.

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
        endpoint: 'http://localhost:8008/uploadFile'  // Your backend file uploader endpoint
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
| endpoint | `string` | **Required** Endpoint for file uploading.
| field | `string` | (default: `image`) Name of uploaded image field in POST request |
| types | `string` | (default: `image/*`) Mime-types of files that can be [accepted with file selection](https://github.com/codex-team/ajax#accept-string).|

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

## Backend response format <a name="server-format"></a>

This Tool works with uploading files from the device

**Scenario:**

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
        "url" : "https://capella.pics/3c0e1b97-bc56-4961-b54e-2a6c2c3260f2.jpg"
    }
}
```

**success** - uploading status. 1 for successful, 0 for failed

**file** - uploaded file data. **Must** contain an `url` field with full public path to the uploaded image.
