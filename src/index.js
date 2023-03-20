import ToolboxIcon from './svg/toolbox.svg';
import './index.css';
import Uploader from './uploader';

/**
 * Timeout when loader should be removed
 */
const LOADER_DELAY = 500;

/**
 * @typedef {object} PersonalityToolData
 * @description Personality Tool's input and output data format
 * @property {string} name — person's name
 * @property {string} description - person's description
 * @property {string} link - link to person's website
 * @property {string} photo - person's photo url
 */

/**
 * @typedef {object} PersonalityConfig
 * @description Config supported by Tool
 * @property {string} endpoint - image file upload url
 * @property {string} field - field name for uploaded image
 * @property {string} types - available mime-types
 * @property {string} namePlaceholder - placeholder for name field
 * @property {string} descriptionPlaceholder - description placeholder
 * @property {string} linkPlaceholder - link placeholder
 */

/**
 * @typedef {object} UploadResponseFormat
 * @description This format expected from backend on file uploading
 * @property {number} success - 1 for successful uploading, 0 for failure
 * @property {object} file - Object with file data.
 *                           'url' is required,
 *                           also can contain any additional data that will be saved and passed back
 * @property {string} file.url - [Required] image source URL
 */

/**
 * Personality Tool for the Editor.js
 */
export default class Personality {
  /**
   * @param {PersonalityToolData} data - Tool's data
   * @param {PersonalityConfig} config - Tool's config
   * @param {API} api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;

    this.nodes = {
      wrapper: null,
      name: null,
      description: null,
      link: null,
      photo: null
    };

    this.config = {
      endpoint: config.endpoint || '',
      field: config.field || 'image',
      types: config.types || 'image/*',
      namePlaceholder: config.namePlaceholder || 'Name',
      descriptionPlaceholder: config.descriptionPlaceholder || 'Description',
      linkPlaceholder: config.linkPlaceholder || 'Link'
    };

    /**
     * Set saved state
     */
    this.data = data;

    /**
     * Module for image files uploading
     */
    this.uploader = new Uploader({
      config: this.config,
      onUpload: (response) => this.onUpload(response),
      onError: (error) => this.uploadingFailed(error)
    });
  }

  /**
   * Get Tool toolbox settings
   * icon - Tool icon's SVG
   * title - title to show in toolbox
   */
  static get toolbox() {
    return {
      icon: ToolboxIcon,
      title: 'Personality'
    };
  }

  /**
   * File uploading callback
   * @param {UploadResponseFormat} response
   */
  onUpload(response) {
    const { body: { success, file } } = response;

    if (success && file && file.url) {
      this.data.photo = file.url;

      this.showFullImage();
    }
  }
  
  /**
   * Set photo node url background
   * @param {String} photo url
   */
  setFullImageSource(photo) {
    this.nodes.photo.style.background = `url('${photo}') center center / cover no-repeat`;
  }

  /**
   * On success: remove loader and show full image
   */
  showFullImage() {
    setTimeout(() => {
      this.nodes.photo.classList.remove(this.CSS.loader);
      this.setFullImageSource(this.data.photo);
    }, LOADER_DELAY);
  }

  /**
   * On fail: remove loader and reveal default image placeholder
   */
  stopLoading() {
    setTimeout(() => {
      this.nodes.photo.classList.remove(this.CSS.loader);
      this.nodes.photo.removeAttribute('style');
    }, LOADER_DELAY);
  }

  /**
   * Show loader when file upload started
   */
  addLoader() {
    this.nodes.photo.style.background = 'none';
    this.nodes.photo.classList.add(this.CSS.loader);
  }

  /**
   * If file uploading failed, remove loader and show notification
   * @param {string} errorMessage -  error message
   */
  uploadingFailed(errorMessage) {
    this.stopLoading();

    this.api.notifier.show({
      message: errorMessage,
      style: 'error'
    });
  }

  /**
   * Tool's CSS classes
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      input: this.api.styles.input,
      loader: this.api.styles.loader,

      /**
       * Tool's classes
       */
      wrapper: 'cdx-personality',
      name: 'cdx-personality__name',
      photo: 'cdx-personality__photo',
      link: 'cdx-personality__link',
      description: 'cdx-personality__description'
    };
  }

  /**
   * Return Block data
   * @param {HTMLElement} toolsContent
   * @return {PersonalityToolData}
   */
  save(toolsContent) {
    const name = toolsContent.querySelector(`.${this.CSS.name}`).textContent;
    const description = toolsContent.querySelector(`.${this.CSS.description}`).textContent;
    const link = toolsContent.querySelector(`.${this.CSS.link}`).textContent;
    const photo = this.data.photo;

    /**
     * Fill missing fields with empty strings
     */
    Object.assign(this.data, {
      name: name.trim() || '',
      description: description.trim() || '',
      link: link.trim() || '',
      photo: photo || ''
    });

    return this.data;
  }

  /**
   * Renders Block content
   * @return {HTMLDivElement}
   */
  render() {
    const { name, description, photo, link } = this.data;

    this.nodes.wrapper = this.make('div', this.CSS.wrapper);

    this.nodes.name = this.make('div', this.CSS.name, {
      contentEditable: true
    });

    this.nodes.description = this.make('div', this.CSS.description, {
      contentEditable: true
    });

    this.nodes.link = this.make('div', this.CSS.link, {
      contentEditable: true
    });

    this.nodes.photo = this.make('div', this.CSS.photo);

    if (photo) {
      this.setFullImageSource(photo);
    }

    if (description) {
      this.nodes.description.textContent = description;
    } else {
      this.nodes.description.dataset.placeholder = this.config.descriptionPlaceholder;
    }

    if (name) {
      this.nodes.name.textContent = name;
    } else {
      this.nodes.name.dataset.placeholder = this.config.namePlaceholder;
    }

    if (link) {
      this.nodes.link.textContent = link;
    } else {
      this.nodes.link.dataset.placeholder = this.config.linkPlaceholder;
    }

    this.nodes.photo.addEventListener('click', () => {
      this.uploader.uploadSelectedFile({
        onPreview: () => {
          this.addLoader();
        }
      });
    });

    this.nodes.wrapper.appendChild(this.nodes.photo);
    this.nodes.wrapper.appendChild(this.nodes.name);
    this.nodes.wrapper.appendChild(this.nodes.description);
    this.nodes.wrapper.appendChild(this.nodes.link);

    return this.nodes.wrapper;
  }

  /**
   * Validate saved data
   * @param {PersonalityToolData} savedData - tool's data
   * @returns {boolean} - validation result
   */
  validate(savedData) {
    /**
     * Return false if fields are empty
     */
    return savedData.name ||
        savedData.description ||
        savedData.link ||
        savedData.photo;
  }

  /**
   * Helper method for elements creation
   * @param tagName
   * @param classNames
   * @param attributes
   * @return {HTMLElement}
   */
  make(tagName, classNames = null, attributes = {}) {
    const el = document.createElement(tagName);

    if (Array.isArray(classNames)) {
      el.classList.add(...classNames);
    } else if (classNames) {
      el.classList.add(classNames);
    }

    for (const attrName in attributes) {
      el[attrName] = attributes[attrName];
    }

    return el;
  }
}
