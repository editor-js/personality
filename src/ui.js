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