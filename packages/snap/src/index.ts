import { OnRpcRequestHandler, OnTransactionHandler } from '@metamask/snaps-types';
import { panel, text, heading } from '@metamask/snaps-ui';



// Handle outgoing transactions.
export const onTransaction: OnTransactionHandler = async ({ transaction }) => {

  let { to } = transaction;

  // let url = "https://id.yug.network/api/test-server";
  let url = 'https://id.yug.network/api/profile/check-verified'


  const options = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify({
      account: to,
      kind: 1
    }),
  };

  let response: any = await fetch(url, options);
  response = await response.json()
  const verified: boolean = response?.response

  const header = verified ? 'Verified Address' : 'Unverified Address';
  const subText = verified ? 'The address is verified by Yug and is safe to transfer.' : `The address is not verified and is not safe to transfer. You could be prosecuted in future if recipient address is involved in illegal activity.`

  return {
    content: panel([
      heading(header),
      text(subText),
    ]),
  };
};
