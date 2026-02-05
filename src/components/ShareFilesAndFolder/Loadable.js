/**
 *
 * Asynchronously loads the component for ShareFilesAndFolder
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
