import React, { Component } from 'react'
// Allows us to push data
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Router from 'next/router'
import Error from './ErrorMessage'
import formatMoney from '../lib/formatMoney'
import Form from './styles/Form'
import { consolidateStreamedStyles } from 'styled-components'

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    # This mutation is defined in backend/src/schema.graphql
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`

class CreateItem extends Component {
  state = {
    title: 'Default Title',
    description: 'Default Description',
    image: 'default_image.jpg',
    largeImage: 'default_image_large.png',
    price: 1000.0
  }

  // arrow function is important here
  // it allows us access to `this`
  _handleChange = e => {
    const { name, type, value } = e.target

    // Need to coerce input to a proper number if it is a number
    const val = type === 'number' ? parseFloat(value) : value

    // [name] here sets the state dynamically based on the input name
    // This allows us to use the same handler for all input fields
    this.setState({ [name]: val })
  }

  _uploadFile = async e => {
    const files = e.target.files
    const data = new FormData()
    data.append('file', files[0])
    // 'sick_fits" maps to the string we mapped to an "upload preset" in cloudinary
    data.append('upload_preset', 'sick_fits')

    const res = await fetch(
      'https://api.cloudinary.com/v1_1/du346j44g/image/upload/',
      {
        method: 'POST',
        body: data
      }
    )

    const file = await res.json()

    this.setState({
      image: file.secure_url,
      largeImage: file.eager[0].secure_url
    })
  }

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              // Stop the form from submitting
              e.preventDefault()
              // call the mutation
              const res = await createItem()
              // change them to the singe item page
              console.log(res)
              Router.push({
                pathname: '/item',
                query: { id: res.data.createItem.id }
              })
            }}
          >
            {/* Error component was made by Wes. Conditionally displays if error */}
            <Error error={error} />
            {/* disabled greys everything out */}
            {/* aria-busy uses keyframes to animate. This is set in Form.js css styles */}
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an Image"
                  required
                  // value={this.state.image}
                  onChange={this._uploadFile}
                />
                {this.state.image && (
                  <img
                    width="200"
                    src={this.state.image}
                    alt="Upload Preview"
                  />
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  value={this.state.title}
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
                  value={this.state.price}
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
                  value={this.state.description}
                  onChange={this._handleChange}
                />
              </label>
              <button type="submit">Submit ✔️</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default CreateItem
export { CREATE_ITEM_MUTATION }
