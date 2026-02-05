/**
 *
 * Asynchronously loads the component for CollectionFieldTypeSelector
 *
 */

import React from 'react';
import loadable from 'utils/loadable';
import LoadingIndicator from 'components/LoadingIndicator';

export default loadable(() => import('./index'), {
    fallback: <LoadingIndicator />,
});
