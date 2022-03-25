import { useState } from 'react'
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketaddress } from '../config'

import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import NFTMarket from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreatItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, setFormInput] = useState({
    price: '',
    name: '',
    description: '',
  })
  const router = useRouter()

  async function onChange(e) {
    const file = e.target.files[0]

    try {
      const added = await client.add(file, {
        progres: (prog) => console.log(`recieved: ${prog}`),
      })
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.error(error)
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput
    if (!name || !description || !price) return

    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      return url
    } catch (error) {
      console.log('error uploading file', error)
    }
  }

  async function createSales() {
    const url = await uploadToIPFS()
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    let contract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await contract.createToken(url)
    let tx = await transaction.wait()

    let event = tx.events[0]
    let value = event.args[2]
    let tokenId = value.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    contract = new ethers.Contract(nftmarketaddress, NFTMarket.abi, signer)
    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await contract.createMarketItem(nftaddress, tokenId, price, {
      value: listingPrice,
    })

    await transaction.wait()
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="flex w-1/2 flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 rounded border p-4"
          onChange={(e) => setFormInput({ ...formInput, name: e.target.value })}
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 rounded border p-4"
          onChange={(e) =>
            setFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in Matic"
          className="mt-2 rounded border p-4"
          onChange={(e) =>
            setFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="mt-4 rounded" width="350" src={fileUrl} />}
        <button
          onClick={createSales}
          className="mt-4 rounded bg-pink-500 p-4 font-bold text-white shadow-lg"
        >
          Create NFT
        </button>
      </div>
    </div>
  )
}
