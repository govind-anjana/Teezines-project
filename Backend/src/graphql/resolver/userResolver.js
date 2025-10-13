import graphql from "../../model/graphqlModel.js";
const UserResolver = {
  Query: {
    getUsers: async () => {
      return await graphql.find();
    },
    getUser: async (_, { id }) => {
      return await graphql.findById(id);
    },
  },
  Mutation: {
    createUser: async (_, { name, email }) => {
       const exist=await graphql.findOne({email})
      if(exist) throw new Error("Email alredy Exist")
      const newUser = new graphql({ name, email });
      return await newUser.save();
    },
    updateUser: async (_, { id, name, email }) => {
      const update = {};
      const existUser = await graphql.findOne({ id, email });
      if (existUser) throw new Error("Email alredy Exist");
      (update.email = email), (update.name = name);
      return await graphql.findByIdAndUpdate(id, update, { new: true });
    },
    deleteUser: async (_, { id }) => {
      const deletedUser = await graphql.findByIdAndDelete(id);
      if (!deletedUser) throw new Error("User not found");
      return deletedUser;
    },
  },
};

export default UserResolver;
