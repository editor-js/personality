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
    require('./css/styles.css');

    var ui       = require('./ui');
    var saver    = require('./saver');
    var uploader = require('./uploader');

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