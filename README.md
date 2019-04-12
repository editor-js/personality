![](https://badgen.net/badge/CodeX%20Editor/v1.0/gray)

# Personality Tool for Editor.js

This tool allows you to create Personality block in your articles.

![Example](https://ifmo.su/public/img/external/personality.png)

## Install via npm

```shell
npm i --save codex.editor.personality
```

#### Connect with Webpack
Include module in your application
```js
var cdxEditorPersonality = require('exports-loader?cdxEditorPersonality!codex.editor.personality');
```
Include CSS filee
```css
@import url("~codex.editor.personality/personality.css");
```
You will need `exports-loader`, `css-loader` and `file-loader`.

## Install directly

1. Download folder
2. Add `personality.js` and `personality.css` files on your page

## Usage

Pass new tool to the `codex.editor.start` method in `tools` array:

```js
personality: {
    type             : 'personality',
    displayInToolbox : true,
    iconClassname    : 'cdx-personality-icon',
    prepare          : cdxEditorPersonality.prepare,
    render           : cdxEditorPersonality.render,
    save             : cdxEditorPersonality.save,
    validate         : cdxEditorPersonality.validate,
    destroy          : cdxEditorPersonality.destroy,
    enableLineBreaks : true,
    showInlineToolbar: true,
    config: {
        uploadURL: '/uploadPhoto',
    }
}
```
5. Specify `config.uploadURL` with route for file uploading. 

### File uploading

To set personality photo, you will need server-side image uploader method.

Tool will send selected file on the route passed with `config.uploadURL`. Then you free to implement your own file-saving scheme. 

Expected server response format: 

```json
{
  "success": 1,
  "data" : {
    "url" : "/uploaded/file/path.jpg"
  }
}
```

## CodeX Editor

API oriented, open-source, block-styled Edtior.

https://github.com/codex-team/codex.editor

## Authors 

We are small team of Web-developing fans consisting of IFMO students and graduates located in St. Petersburg, Russia.
Fell free to give us a feedback on <a href="mailto::team@ifmo.su">team@ifmo.su</a>

https://ifmo.su

### Follow us!

VK: https://vk.com/codex_team

Telegram: https://t.me/codex_team

Instagram: https://www.instagram.com/codex_team
