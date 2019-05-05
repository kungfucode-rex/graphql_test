import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import { getAuthorsQuery, getBooksQuery, addBookMutation } from '../queries/queries';

class AddBook extends Component {
    state = {
        name: '',
        genre: '',
        authorId: ''
    };

    displayAuthors = () => {
        const getAuthorsQuery = this.props.getAuthorsQuery;
        if(getAuthorsQuery.loading) {
            return (<option disabled>Loading authors ... </option>);
        } else {
            return getAuthorsQuery.authors.map(author => {
                return (
                    <option key={author.id} value={author.id}>{author.name}</option>
                )
            });
        }
    }

    submitForm = (e) => {
        e.preventDefault();
        this.props.addBookMutation({
            variables: this.state,
            refetchQueries: [{ query: getBooksQuery }]
        });
    }

    render() {
        console.log(this.props)
        return (
            <form onSubmit={this.submitForm}>
                <div className="field">
                    <label>Book Name:</label>
                    <input type="text" onChange={(e) => this.setState({name: e.target.value})} />
                </div>
                <div className="field">
                    <label>Book Genre:</label>
                    <input type="text" onChange={(e) => this.setState({genre: e.target.value})} />
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select onChange={(e) => this.setState({authorId: e.target.value})} >
                        {this.displayAuthors()}
                    </select>
                </div>
                <div>
                    <button>Add</button>
                </div>
            </form>
        );
    }
}

export default compose(
    graphql(getAuthorsQuery, {name: 'getAuthorsQuery'}),
    graphql(addBookMutation, {name: 'addBookMutation'})
)(AddBook);
