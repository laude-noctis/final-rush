const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              return User.findOne({ _id: context.user._id });
            }
            throw AuthenticationError;
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
            console.log(username, email, password)
            const newUser = await User.create({ username, email, password });
            console.log(newUser)
            const token = signToken(newUser)
            return { token, user: newUser }
        },
        saveBook: async (parent, { input }, context) => {
            const saveBook = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
              );
              return saveBook 
        },
        removeBook: async (parent, { bookId }, context) => {
            const removeBook = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            return removeBook
        } 
    }
}

module.exports = resolvers