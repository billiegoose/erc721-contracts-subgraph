import { ByteArray, Bytes } from "@graphprotocol/graph-ts"
import {
  ERC721Token,
  Transfer
} from "../generated/ERC721Token/ERC721Token"
import { Contract } from "../generated/schema"

let ERC721_INTERFACE = ByteArray.fromHexString('80ac58cd') as Bytes;
let ERC721_METADATA_INTERFACE = ByteArray.fromHexString(('5b5e139f')) as Bytes;
// let ERC721_ENUMERABLE_INTERFACE = ByteArray.fromHexString(('780e9d63')) as Bytes;

function supportsInterface(contract: ERC721Token, interfaceId: Bytes): boolean {
  let result = contract.try_supportsInterface(interfaceId);
  return !result.reverted && result.value;
}

export function handleTransfer(event: Transfer): void {
  let entity = Contract.load(event.address.toHex());

  // We only insert the entry the very first time, we won't update it.
  // Yes, that means the `totalSupply` value will be pretty useless for new contracts.
  // This is so we can avoid interacting with the smart contract at all if possible,
  // to reduce running time to as little as possible.
  if (entity !== null) return;

  let contract = ERC721Token.bind(event.address);

  if (supportsInterface(contract, ERC721_INTERFACE)) {
    entity = new Contract(event.address.toHex())

    if (supportsInterface(contract, ERC721_METADATA_INTERFACE)) {
      let name = contract.try_name();
      if (name.value !== null) entity.name = name.value;
      let symbol = contract.try_symbol();
      if (symbol.value !== null) entity.symbol = symbol.value;
    }

    // if (supportsInterface(contract, ERC721_ENUMERABLE_INTERFACE)) {
    //   let totalSupply = contract.try_totalSupply()
    //   if (totalSupply.value !== null) entity.totalSupply = totalSupply.value;
    // }
    entity.save();
  }
}
