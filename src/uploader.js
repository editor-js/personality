/**
 * Uploader module for Personality tool
 * @author  CodeX Team
 */
module.exports = function (uploader) {

    'use strict';

    var ui = require('./ui');

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

        console.log('beforeSend this %o', selectPhotoButton);

        /**
         * Returned value will be passed as context of success and error
         */
        return preview(selectPhotoButton);

    }

    /**
     * Success uploading hanlder
     * @this - beforeSend result
     * @param {String} response - upload response
     */
    function success( response ) {

        console.log('Success this %o', this);
        console.log('Success response %o', response);

        let preview = this;

        response = JSON.parse(response);

        console.assert(response.url, 'Expected photo URL was not found in response data');

        updatePreview(preview, response.url);
        preview.classList.remove(ui.css.photoPreview);

    }

    /**
     * Error during upload handler
     * @this {Element} preview
     */
    function failed() {

        console.log('Error this %o', this);

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