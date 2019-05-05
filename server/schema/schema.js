const _ = require('lodash');
const Book = require('../models/book');
const Author = require('../models/author');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLSchema
} = require('graphql');

const books = [
    { name: '算法导论', genre: '计算机科学', id: '1', authorId: '1' },
    { name: '人性的弱点', genre: '社交', id: '2', authorId: '3' },
    { name: 'GraphQL 教程', genre: '历史', id: '3', authorId: '4' },
    { name: 'Java 教程', genre: '历史', id: '4', authorId: '4' },
    { name: 'JavaScript 教程', genre: '历史', id: '5', authorId: '4' },
    { name: 'HTML 教程', genre: '历史', id: '6', authorId: '4' }
]

const authors = [
    { name: 'Rex', age: 30, id: '1' },
    { name: 'Belinda', age: 29, id: '2' },
    { name: 'Max', age: 28, id: '3' },
    { name: 'Even', age: 29, id: '4' },
    { name: 'Alice', age: 31, id: '5' }
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                // 从哪里得到数据，如数据库
                // return _.find(authors, { id: parent.authorId })
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                // return _.filter(books, { authorId: parent.id })
                return Book.find({ authorId: parent.id});
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // 从哪里得到数据，如数据库
                // return _.find(books, { id: args.id })
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID }},
            resolve(parent, args) {
                // 从哪里得到数据，如数据库
                // return _.find(authors, { id: args.id })
                return Author.findById(args.id);
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find();
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find();
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: GraphQLID }
            },
            resolve(parent, args) {
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})