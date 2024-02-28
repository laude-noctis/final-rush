const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, { username }) => {
            return User.findOne({ username })
        },
    },

    Mutation: {
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw AuthenticationError
            }

            const token = signToken(user)

            return { token, user }
        },
        addUser: async (parent, { username, email, password }) => {
            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser)
            return { token, newUser }
        },
        saveBook: async (parent, { input }, context) => {
            const saveBook = await User.findOneAndUpdate(
                { _id: user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
              return saveBook 
        },
        removeBook: async (parent, { bookId }, context) => {
            const removeBook = await User.findOneAndUpdate(
                { _id: user._id },
                { $pull: { savedBooks: { bookId: params.bookId } } },
                { new: true }
            );
            return removeBook
        } 
    }
}