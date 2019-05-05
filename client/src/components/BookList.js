import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { getBooksQuery } from '../queries/queries';
import BookDetails from './BookDetails';

class BookList extends Component {
    state = {
        bookId: ''
    };
    displayBooks = () => {
        const data = this.props.data;
        if(data.loading) {
            return (<div>Loading books ... </div>);
        } else {
            return (<ul>{
                data.books.map(book => {
                    return (
                        <li key={book.id} onClick={(e) => this.setState({ bookId: book.id })}>{book.name}</li>
                    )
                })
            }</ul>);
        }
    }

    render() {
        return (
            <div>
                <ul id="book-list">
                    {this.displayBooks()}
                </ul>
                <BookDetails bookId={this.state.bookId} />
            </div>
        );
    }
}

export default graphql(getBooksQuery)(BookList);
