/*
 * FieldSetRenderLayout Messages
 *
 * This contains all the text for the FieldSetRenderLayout component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.FieldSetRenderLayout';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the FieldSetRenderLayout component!',
  },
  fieldShoulfBeUnique: {
    id: `${scope}.fieldShoulfBeUnique`,
    defaultMessage: 'Field should be unique within Field Set',
  },
});
