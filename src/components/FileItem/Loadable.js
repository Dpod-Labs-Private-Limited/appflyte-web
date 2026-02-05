/**
 *
 * Asynchronously loads the component for FileItem
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
