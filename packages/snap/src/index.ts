import {
  OnRpcRequestHandler,
  OnTransactionHandler,
} from '@metamask/snaps-types';
import { panel, text, heading, divider, copyable } from '@metamask/snaps-ui';

// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {
  let { from, to } = transaction;

  // let url = "https://id.yug.network/api/test-server";
  let url = 'https://id.yug.network/api/profile/check-verified';

  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify({
      account: to,
      kind: 1,
    }),
  };

  let senderResponse: any = await fetch(url, {
    ...options,
    body: JSON.stringify({
      account: from,
      kind: 1,
    }),
  });
  senderResponse = await senderResponse.json();
  const isSenderVerified: boolean = senderResponse?.response;

  let response: any = await fetch(url, options);
  response = await response.json();
  const verified: boolean = response?.response;

  const header = verified ? 'Verified Address' : 'Unverified Address';
  const subText = verified
    ? 'The address is verified by Yug and is safe to transfer.'
    : `The address is not verified and is not safe to transfer. You could be prosecuted in future if recipient address is involved in illegal activity.`;

  let responseContent: any = [];
  if (isSenderVerified && verified) {
    responseContent = [
      heading('Recipient is Verified'),
      text('The address is verified by Yug and is safe to transfer.'),
    ];
  } else if (!isSenderVerified && verified) {
    responseContent = [
      heading('Recipient is Verified'),
      text(
        'The Recipient is verified by Yug and is safe to transfer but your Account is not compliant.',
      ),
      text('Use below link to get compliant.'),
      copyable(`https://id.yug.network`),
    ];
  } else if (isSenderVerified && !verified) {
    responseContent = [
      heading('Recipient is not Verified'),
      text(
        'The address is not verified and is not safe to transfer. You could be prosecuted in future if recipient address is involved in illegal activity.',
      ),
      text('Use below link to get compliant.'),
      copyable(`https://id.yug.network`),
    ];
  } else if (!isSenderVerified && !verified) {
    responseContent = [
      heading('Unverified Accounts'),
      text('Your account and recipient account are both not compliant'),
      text('Use below link to get compliant.'),
      copyable(`https://id.yug.network`),
    ];
  }

  return {
    content: panel(responseContent),
    // content: panel([
    //   text('**General Information**'),
    //   text(JSON.stringify(transaction)),
    //   divider(),
    //   heading(header),
    //   text(subText),
    // ]),
  };
};
