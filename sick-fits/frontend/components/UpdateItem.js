import React, { Component } from 'react'
import { Mutation, Query } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Form from './styles/Form'
import formatMoney from '../lib/formatMoney'
import Error from './ErrorMessage'

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`
const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    # This mutation is defined in backend/src/schema.graphql
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`

class UpdateItem extends Component {
  state = {}

  _handleChange = e => {
    const { name, type, value } = e.target

    // Need to coerce input to a proper number if it is a number
    const val = type === 'number' ? parseFloat(value) : value

    // [name] here sets the state dynamically based on the input name
    // This allows us to use the same handler for all input fields
    this.setState({ [name]: val })
  }

  _updateItem = async (e, updateItemMutation) => {
    e.preventDefault()
    console.log('Updating Item...')
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...this.state
      }
    })
    console.log('Updated!')
  }

  render() {
    return (
      // Query component to fetch the item info.
      // Docs on react-apollo <Query> component here:
      // https://www.apollographql.com/docs/react/essentials/queries/
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ data, loading }) => {
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No Item found for ID {this.props.id}</p>
          return (
            // Apollo <Mutation> docs: https://www.apollographql.com/docs/react/essentials/mutations/
            <Mutation mutation={UPDATE_ITEM_MUTATION} variables={this.state}>
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this._updateItem(e, updateItem)}>
                  {/* Error component was made by Wes. Conditionally displays if error */}
                  <Error error={error} />
                  {/* disabled greys everything out */}
                  {/* aria-busy uses keyframes to animate. This is set in Form.js css styles */}
                  <fieldset disabled={loading} aria-busy={loading}>
                    <label htmlFor="title">
                      Title
                      <input
                        type="text"
                        id="title"
                        name="title"
                        placeholder="Title"
                        required
                        defaultValue={data.item.title}
                        onChange={this._handleChange}
                      />
                    </label>
                    <label htmlFor="price">
                      Price
                      <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="Price"
                        required
                        defaultValue={data.item.price}
                        onChange={this._handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      Description
                      <input
                        type="text"
                        id="description"
                        name="description"
                        placeholder="Enter A Description"
                        required
                        defaultValue={data.item.description}
                        onChange={this._handleChange}
                      />
                    </label>
                    <button type="submit">
                      Sav{loading ? 'ing' : 'e'} Changes ✔️
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
