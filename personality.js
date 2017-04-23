var cdxEditorPersonality =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/**
 * Interface for Personality tool
 * @author CodeX Team
 */
module.exports = function (ui) {

    'use strict';

    /**
     * CSS class names
     * @type {Object}
     */
    ui.css = {
        holder       : 'cdx-personality',
        name         : 'cdx-personality__name',
        cite         : 'cdx-personality__cite',
        url          : 'cdx-personality__url',
        photo        : 'cdx-personality__photo',
        photoPreview : 'cdx-personality__photo--preview'
    };

    /**
     * Creates Element
     * @param {string} tagName
     * @param {string} className
     * @param {object} properties - allow to assign properties
     */
    let create = function ( tagName, className, properties ) {

        var el = document.createElement( tagName );

        if ( className ) el.className = className;

        if ( properties ) {

            for (var name in properties) {

                el[name] = properties[name];

            }

        }

        return el;

    };

    /**
     * Creates plugin holder
     * @return {Element}
     */
    ui.holder = function () {

        return create('DIV', ui.css.holder);

    };

    /**
     * Input for personality name
     * @param {String} savedName
     * @return {Element}
     */
    ui.nameInput = function (savedName) {

        var name = create('INPUT', ui.css.name);

        name.placeholder = 'Введите имя';
        name.value = savedName || '';

        return name;

    };

    /**
     * Input for personality description
     * @param {String} savedCite
     * @return {Element}
     */
    ui.citeInput = function (savedCite) {

        var div = create('DIV', ui.css.cite);

        div.contentEditable = true;
        div.setAttribute('data-placeholder', 'Должность или другая информация');
        div.innerHTML = savedCite || '';

        return div;

    };

    /**
     * Input for personality URL
     * @param {String} savedUrl
     * @return {Element}
     */
    ui.urlInput = function (savedUrl) {

        var url = create('INPUT', ui.css.url);

        url.placeholder = 'Ссылка на страницу человека';
        url.value = savedUrl || '';

        return url;

    };

     /**
     * @return {Element}
     * @param {String} savedPhoto image URL
     */
    ui.photo = function (savedPhoto) {

        var photo = create('DIV', ui.css.photo),
            img;

        if (savedPhoto) {

            img = document.createElement('IMG');
            img.src = savedPhoto;
            photo.appendChild(img);

        }

        return photo;

    };

    return ui;

}({});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Saver module for Personality tool
 * @author  CodeX Team
 */
module.exports = function (saver) {

    'use strict';

    var ui = __webpack_require__(0);

    /**
     * Extracts data from block
     * @param  {Element} block
     * @return {Object}
     */
    saver.extractData = function (block) {

        var nameEl = block.querySelector(`.${ui.css.name}`),
            citeEl = block.querySelector(`.${ui.css.cite}`),
            urlEl  = block.querySelector(`.${ui.css.url}`),
            photo  = block.querySelector(`.${ui.css.photo} img`),
            toolData = {};

        toolData.name = nameEl.value;
        toolData.cite = codex.editor.content.wrapTextWithParagraphs(citeEl.innerHTML);
        toolData.url  = urlEl.value;
        toolData.photo = null;

        if (photo) {

            toolData.photo = photo.src;

        }

        return toolData;

    };

    /**
     * Validation method
     * @param  {Object} toolData - saving data that needs to check
     * @return {Boolean}         - TRUE if data is value
     */
    saver.validate = function (toolData) {

        /** Dont allow empty name */
        if (!toolData.name.trim()) {

            return false;

        }

        return true;

    };

    return saver;

}({});

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Uploader module for Personality tool
 * @author  CodeX Team
 */
module.exports = function (uploader) {

    'use strict';

    var ui = __webpack_require__(0);

    /**
     * External config
     * @type {Object}
     */
    uploader.config = {
        uploadURL : ''
    };

    /**
     * Updates preview image
     * @return {Element} preview - preview IMG
     * @return {String} src      - preview image source
     */
    function updatePreview( preview, src ) {

        preview.src = src;

    }


    /**
     * Makes images preview
     * @param  {HTMLElement} holder
     */
    function preview(holder) {

        var input = codex.editor.transport.input,
            files = input.files,
            reader,
            preview = document.createElement('IMG');

        console.assert( files, 'There is no files in input');

        reader = new FileReader();
        reader.readAsDataURL(files[0]);

        preview.classList.add(ui.css.photoPreview);
        holder.innerHTML = '';
        holder.appendChild(preview);

        reader.onload = function ( e ) {

            updatePreview(preview, e.target.result);

        };

        return preview;

    }

    /**
     * Before send method
     * @this {Button clicked}
     */
    function beforeSend() {

        var selectPhotoButton = this;

        /**
         * Returned value will be passed as context of success and error
         */
        return preview(selectPhotoButton);

    }

    /**
     * Success uploading hanlder
     * @this - beforeSend result
     * @param {String} response - upload response
     *
     * Expected response format:
     * {
     *     success : 1,
     *     data: {
     *         url : 'site/filepath.jpg'
     *     }
     * }
     */
    function success( response ) {

        let preview = this;

        response = JSON.parse(response);

        console.assert(response.data && response.data.url, 'Expected photo URL was not found in response data');

        updatePreview(preview, response.data.url);
        preview.classList.remove(ui.css.photoPreview);

    }

    /**
     * Error during upload handler
     * @this {Element} preview
     */
    function failed() {

        var preview = this;

        codex.editor.notifications.notification({type: 'error', message: 'Ошибка во время загрузки. Попробуйте другой файл'});

        preview.remove();

    }

    /**
     * Select file click listener
     * @return {[type]} [description]
     */
    uploader.photoClicked = function () {

        var button = this;

        codex.editor.transport.selectAndUpload({
            url         : uploader.config.uploadURL,
            multiple    : false,
            accept      : 'image/*',
            beforeSend  : beforeSend.bind(button),
            success     : success,
            error       : failed
        });

    };

    return uploader;

}({});

/***/ }),
/* 3 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Personality
 * Tool for CodeX Editor
 *
 * @author CodeX Team
 * @version 1.0.0
 * @see https://github.com/codex-editor/personality
 *
 * @description Provides public interface methods
 */
module.exports = function () {

    'use strict';

    /**
     * Styleheets
     */
    __webpack_require__(3);

    var ui       = __webpack_require__(0);
    var saver    = __webpack_require__(1);
    var uploader = __webpack_require__(2);

    /**
     * @param {Object} toolData
     * @param {string} toolData.name    - Personality name
     * @param {string} toolData.cite    - Personality cite
     * @param {string} toolData.url     - Personality url
     * @param {string} toolData.photo   - Personality photo URL
     *
     * @return {Element} personality tool block
     */
    function render( toolData ) {

        toolData = toolData || {};

        var pluginHolder = ui.holder(),
            name         = ui.nameInput(toolData.name),
            cite         = ui.citeInput(toolData.cite),
            url          = ui.urlInput(toolData.url),
            photo        = ui.photo(toolData.photo);

        pluginHolder.appendChild(photo);
        pluginHolder.appendChild(name);
        pluginHolder.appendChild(cite);
        pluginHolder.appendChild(url);

        photo.addEventListener('click', uploader.photoClicked);

        return pluginHolder;

    }

    /**
     * Prepares plugin
     * @param  {Object} config
     * @return {Promise}
     */
    function prepare(config) {

        return Promise.resolve().then(function () {

            uploader.config = config;

        });

    }

    /**
     * Validation
     * @param  {Object} savingData - tool presaved data
     * @fires saver.validate
     * @return {Boolean}
     */
    function validate( savingData ) {

        return saver.validate(savingData);

    }

    /**
     * Destroy method
     */
    function destroy() {

        window.cdxEditorPersonality = null;

    }

    /**
     * Saving method
     * @param  {Element} block   - plugin content
     * @return {Object}          - personality data
     */
    function save( block ) {

        var data = saver.extractData(block);

        return data;

    }

    return {
        render, save, validate, destroy, prepare
    };

}();

/***/ })
/******/ ]);