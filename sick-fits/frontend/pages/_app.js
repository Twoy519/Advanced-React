import App, { Container } from 'next/app'
import Page from '../components/Page'
import { ApolloProvider } from 'react-apollo'
import withData from '../lib/withData'

class MyApp extends App {
  // getInitialProps is a special NextJS lifecycle method
  // This whole thing is needed because this is a server-rendered app
  // getInitialProps runs before render()
  // The return value becomes available inside render()
  // What this does is crawl the page for Queries and Mutations
  // and fires them off before we render the pag-e.
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }
    // this exposes the query to the user
    pageProps.query = ctx.query
    return { pageProps }
  }

  render() {
    // `apollo` is accesible because we wrap MyApp
    // with the `withData` higher-order component
    const { Component, apollo, pageProps } = this.props

    return (
      <Container>
        <ApolloProvider client={apollo}>
          <Page>
            {/* Component is going to be Sell or index */}
            <Component {...pageProps} />
          </Page>
        </ApolloProvider>
      </Container>
    )
  }
}

export default withData(MyApp)
