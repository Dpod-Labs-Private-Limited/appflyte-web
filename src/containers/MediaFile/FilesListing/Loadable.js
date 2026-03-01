/**
 *
 * Asynchronously loads the component for FilesListing
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
