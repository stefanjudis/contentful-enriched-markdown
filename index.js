import React, { useState, useEffect } from 'react';
import { render } from 'react-dom';
import { init, locations } from 'contentful-ui-extensions-sdk';
import 'codemirror/lib/codemirror.css';
import '@contentful/forma-36-react-components/dist/styles.css';
import { MarkdownEditor } from '@contentful/field-editor-markdown';
import {
  Button,
  Heading,
  List,
  ListItem,
  Note,
  Paragraph,
} from '@contentful/forma-36-react-components';
import alex from 'alex';

const ROOT_ELEMENT = document.getElementById('root');

init((sdk) => {
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    render(
      <div style={{ maxWidth: '40em', margin: '2em auto' }}>
        <Heading className="" element="h1" testId="cf-ui-heading">
          Alex.js enriched Contentful Markdown editor
        </Heading>
        <Paragraph>
          This application is an example to show the use of{' '}
          <a href="https://www.contentful.com/developers/docs/extensibility/field-editors/">
            the open source field editors
          </a>
          . There is not much to configure here, but you can learn more about
          the concept by reading the following resources:
        </Paragraph>
        <Paragraph style={{ marginTop: '1em' }}>
          <List>
            <ListItem>
              <a href="https://www.contentful.com/developers/docs/extensibility/app-framework/">
                Contentful App Framework
              </a>
            </ListItem>
            <ListItem>
              <a href="https://f36.contentful.com/">Forma 36 design system</a>
            </ListItem>
            <ListItem>
              <a href="https://www.contentful.com/developers/docs/extensibility/field-editors/">
                Open source field editors
              </a>
            </ListItem>
            <ListItem>Soon... Tutorial for this app</ListItem>
          </List>
        </Paragraph>
        <Button
          href="https://github.com/stefanjudis/contentful-enriched-markdown"
          style={{ marginTop: '1em' }}
          target="_blank"
        >
          Read more on GitHub
        </Button>
      </div>,

      ROOT_ELEMENT
    );
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
