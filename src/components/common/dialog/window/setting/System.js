import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class System extends Component {
  render() {
    return (
      <div className="system">
        <div className="form">
          <div className="form-column left">
            <div className="form-cell left"><label htmlFor="thumbnail">{lang_dictionary.window_setting_thumbnail}</label></div>
            <div className="form-cell left"><label htmlFor="notebook">{lang_dictionary.window_setting_notebook}</label></div>
            <div className="form-cell left"><label htmlFor="section">{lang_dictionary.window_setting_section}</label></div>
            <div className="form-cell left"><label htmlFor="note">{lang_dictionary.window_setting_note}</label></div>
          </div>
          <div className="form-column right">
            <div className="form-cell right">
              <select id="thumbnail">
                <option>{lang_dictionary.window_setting_thumbnail_length_1024}</option>
                <option>{lang_dictionary.window_setting_thumbnail_length_800}</option>
                <option>{lang_dictionary.window_setting_thumbnail_length_320}</option>
              </select>
            </div>
            <div className="form-cell right"><input id="notebook" type="text" defaultValue="500" /></div>
            <div className="form-cell right"><input id="section" type="text" defaultValue="500" /></div>
            <div className="form-cell right"><input id="note" type="text" defaultValue="500" /></div>
          </div>
        </div>
      </div>
    );
  }
}
