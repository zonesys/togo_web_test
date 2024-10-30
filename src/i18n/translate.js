import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import ar from './messages/ar';
import { LOCALES_TYPES } from './locales';
import EN_LOCALE from './messages/en';

const translate = (id, value = {}) => <FormattedMessage  id={id} values={{...value}} />;
export const translateToString = (id, value) => {
 /*    const intl = useIntl();
    return intl.formatMessage({ id }, values).toString(); */
    const lang = localStorage.getItem("lang");
    return lang == "en" ? EN_LOCALE[LOCALES_TYPES.ENGLISH][id][value] : ar[LOCALES_TYPES.ARABIC][id][value];
  };
export default translate;
