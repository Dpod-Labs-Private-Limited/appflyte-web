/**
 *
 * Asynchronously loads the component for CollectionTypeAddFieldSetField
 *
 */

import React from 'react';
import loadable from 'utils/loadable';
import LoadingIndicator from 'components/LoadingIndicator';

export default loadable(() => import('./index'), {
    fallback: <LoadingIndicator />,
});
