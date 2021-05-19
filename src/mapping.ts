import { Address, ByteArray, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  ERC721Token,
  Transfer
} from "../generated/ERC721Token/ERC721Token"
import { Contract } from "../generated/schema"

let ERC721_INTERFACE = ByteArray.fromHexString('80ac58cd') as Bytes;
let ERC721_METADATA_INTERFACE = ByteArray.fromHexString(('5b5e139f')) as Bytes;
let NULL_ADDRESS = Address.fromHexString('0000000000000000000000000000000000000000');
let BIG_ONE = BigInt.fromI32(1);

function supportsInterface(contract: ERC721Token, interfaceId: Bytes): boolean {
  let result = contract.try_supportsInterface(interfaceId);
  return !result.reverted && result.value;
}

function isNullAddress(address: Address): boolean {
  return address.equals(NULL_ADDRESS);
}

export function handleTransfer(event: Transfer): void {
  let entity = Contract.load(event.address.toHex());

  if (entity === null) {
    // Note: we only load the Contract the first time
    // This is so we can avoid interacting with the smart contract at all if possible,
    // to reduce running time to as little as possible.
    let contract = ERC721Token.bind(event.address);

    if (supportsInterface(contract, ERC721_INTERFACE)) {
      entity = new Contract(event.address.toHex())
      entity.totalSupply = BigInt.fromI32(0);
      entity.firstTransferTimestamp = event.block.timestamp;
  
      if (supportsInterface(contract, ERC721_METADATA_INTERFACE)) {
        let name = contract.try_name();
        if (name.value !== null) entity.name = name.value;
        let symbol = contract.try_symbol();
        if (symbol.value !== null) entity.symbol = symbol.value;
      }
  
    } else {
      return;
    }
  }

  let totalSupply = entity.totalSupply;

  if (isNullAddress(event.params._from) /* mint */) {
    entity.totalSupply = totalSupply.plus(BIG_ONE);
  } else if (isNullAddress(event.params._to) /* burn */) {
    entity.totalSupply = totalSupply.minus(BIG_ONE);
  }

  entity.lastTransferTimestamp = event.block.timestamp;

  entity.save();
}
