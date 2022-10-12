import { Box, Heading, VStack } from "@chakra-ui/layout"
import { Button, Text } from '@chakra-ui/react'
import { ToDoList } from "components/TodoList"
import { ethers } from "ethers"
import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useState } from 'react'

declare let window: any

const Home: NextPage = () => {
  const [balance, setBalance] = useState<string | undefined>()
  const [currentAccount, setCurrentAccount] = useState<string | undefined>()
  const [chainId, setChainId] = useState<number | undefined>()
  const [chainname, setChainName] = useState<string | undefined>()

  useEffect(() => {
    if (!currentAccount || !ethers.utils.isAddress(currentAccount)) return
    //client side code
    if (!window.ethereum) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(currentAccount).then((result) => {
      setBalance(ethers.utils.formatEther(result))
    })
    provider.getNetwork().then((result) => {
      setChainId(result.chainId)
      setChainName(result.name)
    })

  }, [currentAccount])

  const onClickConnect = () => {
    //client side code
    if (!window.ethereum) {
      console.log("please install MetaMask")
      return
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    provider.send("eth_requestAccounts", [])
      .then((accounts) => {
        if (accounts.length > 0) setCurrentAccount(accounts[0])
      })
      .catch((e) => console.log(e))
  }

  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
    setCurrentAccount(undefined)
  }

  return (
    <>
      <Head>
        <title>My DAPP</title>
      </Head>

      <VStack>
        <Box w='100%' my={4}>
          {currentAccount
            ? <Button type="button" w='100%' onClick={onClickDisconnect}>
              Account:{currentAccount}
            </Button>
            : <Button type="button" w='100%' onClick={onClickConnect}>
              Connect MetaMask
            </Button>
          }
        </Box>
        {currentAccount
          ? <>
            <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
              <Heading my={4} fontSize='xl'>Account info</Heading>
              <Text>ETH Balance of current account: {balance}</Text>
              <Text>Chain Info: ChainId {chainId} name {chainname}</Text>
            </Box>
            {/* <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
              <Heading my={4} fontSize='xl'>Read Token Info</Heading>
              <ReadERC20
                addressContract='0x326C977E6efc84E512bB9C30f76E30c160eD06FB'
                currentAccount={currentAccount}
              />
            </Box> */}
            <Box mb={0} p={4} w='100%' borderWidth="1px" borderRadius="lg">
              <Heading my={4} fontSize='xl'>To Do Tasks</Heading>
              <ToDoList contractAddress='0xabBA944b417D1E1310a673eC410d03B02B7557F6' />
            </Box>

          </>
          : <></>
        }
      </VStack>
    </>
  )
}

export default Home