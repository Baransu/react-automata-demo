import { testStatechart } from 'react-automata';

import { Gallery, statechart } from './Gallery';
import { fixtures } from './stories';

test('whole component with one test suite', () => {
  testStatechart({ statechart, fixtures }, Gallery);
});
