/**
 *
 * Asynchronously loads the component for FileUpload
 *
 */

import loadable from 'utils/loadable';

export default loadable(() => import('./index'));
