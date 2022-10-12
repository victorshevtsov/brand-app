import { Flex, Heading, LinkBox, LinkOverlay, Spacer, useColorModeValue } from '@chakra-ui/react'
import NextLink from "next/link"

const siteTitle = "Brand App"
export default function Header() {

  return (
    <Flex as='header' bg={useColorModeValue('gray.100', 'gray.900')} p={4} alignItems='center'>
      <LinkBox>
        <NextLink href={'/'} passHref>
          <LinkOverlay>
            <Heading size="md">{siteTitle}</Heading>
          </LinkOverlay>
        </NextLink>
      </LinkBox>
      <Spacer />
    </Flex>
  )
}