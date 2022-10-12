import { Container } from '@chakra-ui/react'
import { ReactNode } from 'react'
import Header from './header'

type Props = {
  children: ReactNode
}

export function Layout(props: Props) {
  return (
    <div>
      <Header />
      <Container maxW="container.md" py='8'>
        {props.children}
      </Container>
    </div>
  )
}