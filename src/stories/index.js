import React from 'react';

import { storiesOf } from '@storybook/react';
// import { action } from '@storybook/addon-actions';
// import { linkTo } from '@storybook/addon-links';

// import { Button, Welcome } from '@storybook/react/demo';

import { Machine } from 'xstate';
import { getShortestPaths } from 'xstate/lib/graph';
import { withStatechart } from 'react-automata/lib';

import '../index.css';

import items from '../images.json';
import { statechart, initialData, Gallery } from '../Gallery';

// WIP - based on react-automata/lib/testStatechart.js
const statechartStories = (stories, config, Component) => {
  const paths = getShortestPaths(Machine(config.statechart));

  Object.keys(paths).forEach(key => {
    const initialData = config.fixtures ? config.fixtures.initialData : null;
    const StateMachine = withStatechart(statechart, {
      initialData,
      devTools: true
    })(Component);

    class ComponentWrapper extends React.Component<*> {
      instance: React$Element<*>;

      componentDidMount() {
        paths[key].forEach(({ event, state }) => {
          const fixtures =
            config.fixtures && config.fixtures[state]
              ? config.fixtures[state][event]
              : null;

          if (this.instance) this.instance.handleTransition(event, fixtures);
        });
      }

      render() {
        return <StateMachine ref={n => (this.instance = n)} />;
      }
    }

    stories.add(key, () => <ComponentWrapper />);
  });
};

const fixtures = {
  initialData,
  gallery: {
    SELECT_PHOTO: {
      photo: items[0]
    }
  },
  loading: {
    SEARCH_SUCCESS: {
      items
    }
  }
};

statechartStories(
  storiesOf('Gallery', module),
  { statechart, fixtures },
  Gallery
);
