import React, {Fragment} from 'react';
import {IntlProvider} from 'react-intl';

import {LOCALES} from './locales';
import messages from './messages/index';

export const flattenMessages = ((nestedMessages, prefix = '') => {
    if (nestedMessages === null) {
        return {}
    }
    return Object.keys(nestedMessages).reduce((messages, key) => {
        const value       = nestedMessages[key]
        const prefixedKey = prefix ? `${prefix}.${key}` : key

        if (typeof value === 'string') {
            Object.assign(messages, { [prefixedKey]: value })
        } else {
            Object.assign(messages, flattenMessages(value, prefixedKey))
        }

        return messages
    }, {})
});


const Provider = ({children, locale = LOCALES.en}) => (
    <IntlProvider locale={locale}
                  textComponent={Fragment}
                  messages={flattenMessages(messages[locale])}
    >
        {children}
    </IntlProvider>
);

export default Provider;
