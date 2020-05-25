import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';

import 'codemirror/lib/codemirror.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import { MarkdownEditor } from '@contentful/field-editor-markdown';
import { List, ListItem, Note } from '@contentful/forma-36-react-components';
import alex from 'alex';

const ROOT_ELEMENT = document.getElementById('root');

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(<h1>Hello world</h1>, ROOT_ELEMENT);
    sdk.app.setReady();
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    render(<MyMarkdownEditor sdk={sdk} />, ROOT_ELEMENT);
    sdk.window.startAutoResizer();
  }
});

function MyMarkdownEditor({ sdk }) {
  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    sdk.field.onValueChanged((value) => {
      setWarnings(alex.markdown(value).messages);
    });
  }, []);

  return (
    <div>
      <div style={{ marginBottom: '0.5em' }}>
        {warnings.length ? (
          <Note
            noteType="warning"
            title="There are potential issues in your Markdown"
          >
            <List>
              {warnings.map(({ line, message, name }) => (
                <ListItem key={name}>
                  <strong>Line: {line}</strong>: {message}
                </ListItem>
              ))}
            </List>
          </Note>
        ) : (
          <Note noteType="positive" title="All great!" />
        )}
      </div>

      <MarkdownEditor sdk={sdk} />
    </div>
  );
}
